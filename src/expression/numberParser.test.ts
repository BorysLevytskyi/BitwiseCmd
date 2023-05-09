import exp from 'constants';
import { asIntN } from '../core/utils';
import {numberParser, ParsedNumber} from './numberParser';

describe("parser", () => {

    it('parses decimal number', () => {
        const result = numberParser.parse('10');
        expect(result).not.toBeNull();

        var number = result as ParsedNumber;
        expect(asIntN(number.value)).toBe(10);
        expect(number.base).toBe('dec');
        expect(number.input).toBe('10');
        expect(number.value.maxBitSize).toBe(32);
    });

    it('parses negative numbers', () => {
        expect(numberParser.parse('-1')?.value.num()).toBe(-1);
        expect(numberParser.parse('-0b10')?.value.num()).toBe(-2);
        expect(numberParser.parse('-0x10')?.value.num()).toBe(-16);
    });

    it('parses 64-bit numbers by size', () => {
        const dec = numberParser.parse('3433374389036042');
        expect(dec?.value.toString()).toBe('3433374389036042');
        expect(dec?.value.maxBitSize).toBe(64);
    });

    it('parses 64-bit numbers with L notation', () => {
        const dec = numberParser.parse('10L');
        expect(dec).not.toBeNull();

        expect(dec?.value.value).toBe(BigInt(10));
        expect(typeof dec?.value.value).toBe("bigint");
        expect(dec?.base).toBe('dec');
        expect(dec?.input).toBe('10L');
        expect(dec?.value.maxBitSize).toBe(64);
        
        const bin = numberParser.parse('0b10l');
        expect(bin).not.toBeNull();
        expect(bin?.value.maxBitSize).toBe(64);

        expect(bin?.value.value).toBe(BigInt(2));
        expect(typeof bin?.value.value).toBe("bigint");
        expect(bin?.base).toBe('bin');
        expect(bin?.input).toBe('0b10l');

        const hex = numberParser.parse('0xfL');
        expect(hex).not.toBeNull();
        expect(hex?.value.maxBitSize).toBe(64);

        expect(hex?.value.value.toString()).toBe(BigInt(15).toString());
        expect(typeof hex?.value.value).toBe("bigint");
        expect(hex?.base).toBe('hex');
        expect(hex?.input).toBe('0xfL');
    });


    it('switches to bigint if value exceeds max safe int', () => {
        const unsafeInt = BigInt(Number.MAX_SAFE_INTEGER)+BigInt(1);
        
        const dec = numberParser.parse(unsafeInt.toString());
        expect(dec?.value.value).toEqual(unsafeInt);
        expect(dec?.base).toBe('dec');

        const bin = numberParser.parse("0b" + unsafeInt.toString(2));
        expect(bin?.value.value).toEqual(unsafeInt);
        expect(bin?.base).toEqual('bin');

        const hex = numberParser.parse("0x" + unsafeInt.toString(16));
        expect(hex?.value.value).toEqual(unsafeInt);
        expect(hex?.base).toEqual('hex');
    });

    it('switches to bigint if value exceeds max safe negative int', () => {
        const unsafeInt = BigInt(Number.MIN_SAFE_INTEGER)-BigInt(1);
        
        const dec = numberParser.parse(unsafeInt.toString());
        expect(dec?.value.value.toString()).toEqual(unsafeInt.toString());
        expect(dec?.base).toBe('dec');

        const bin = numberParser.parse("-0b" + unsafeInt.toString(2).replace('-', ''));
        expect(bin?.value.value.toString()).toEqual(unsafeInt.toString());
        expect(bin?.base).toEqual('bin');

        const hex = numberParser.parse("-0x" + unsafeInt.toString(16).replace('-',''));
        expect(hex?.value.value.toString()).toEqual(unsafeInt.toString());
        expect(hex?.base).toEqual('hex');
    });

    it('parses hex number', () => {
        const result = numberParser.parse('0xab');
        expect(result).not.toBeNull();

        var number = result as ParsedNumber;
        expect(number.value.num()).toBe(171);
        expect(number.base).toBe('hex');
        expect(number.input).toBe('0xab');
    });

    it('parses bin number', () => {
        var result = numberParser.parse('0b0110');
        expect(result).not.toBeNull();

        var number = result as ParsedNumber;
        expect(number.value.num()).toBe(6);
        expect(number.base).toBe('bin');
        expect(number.input).toBe('0b0110');
    });

    it('returns null on bad inputs', () => {
        expect(numberParser.parse('abc')).toBeNull();
        expect(numberParser.parse('')).toBeNull();
    });

    it('parses big int', () => {
        var v =  numberParser.parse('1l')?.value
        expect(v?.num()).toBe(1);
    });

    xit('parses single', () => {
        var v =  numberParser.parse('1s')?.value
        expect(v?.maxBitSize).toBe(16);
        expect(v?.num()).toBe(1);

        var v2 =  numberParser.parse('1i8')?.value
        expect(v2).toEqual(v);
    });

    xit('parses byte', () => {
        var v =  numberParser.parse('1b')?.value
        expect(typeof v?.value).toBe("number");
        expect(v?.maxBitSize).toBe(16);
        expect(v?.num()).toBe(1);

        var v2 =  numberParser.parse('1i16')?.value
        expect(v2?.num()).toEqual(v?.num());
    });
});