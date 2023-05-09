import calc from './calc';
import { ScalarValue } from '../expression/expression';
import { Integer, asInteger } from './types';
import { INT32_MAX_VALUE, INT32_MIN_VALUE } from './const';

describe('calc.flipBit', () => {
    it('calculates flipped bit 32-bit number', () => {
        expect(calc.flipBit(0, 31).num()).toBe(1);
        expect(calc.flipBit(1, 31).num()).toBe(0);
        expect(calc.flipBit(-1, 31).num()).toBe(-2);
        expect(calc.flipBit(2147483647, 0).num()).toBe(-1);
        expect(calc.flipBit(-1, 0).num()).toBe(2147483647);
        expect(calc.flipBit(2147483647, 30).num()).toBe(2147483645);
    });

    it('sing-bit in 8-bit number', () => {
        const result = calc.flipBit(new Integer(-1, 8), 0);
        expect(result.maxBitSize).toBe(8);
    });

    it('caulate flipped bit 64-bit nubmer', () => {
        const int64max = asInteger("9223372036854775807");
        expect(calc.flipBit(int64max, 0).num()).toBe(-1);
    });

    it('calculates flipped bit', () => {
        expect(calc.flipBit(0, 31).num()).toBe(1);
        expect(calc.flipBit(1, 31).num()).toBe(0);
        expect(calc.flipBit(-1, 31).num()).toBe(-2);
        expect(calc.flipBit(2147483647, 0).num()).toBe(-1);
        expect(calc.flipBit(-1, 0).num()).toBe(2147483647);
        expect(calc.flipBit(2147483647, 30).num()).toBe(2147483645);
    });

    
    it('calcualte 31th bit in 64-bit int', () => {
        const n = asInteger(-1);
        expect(calc.flipBit(calc.promoteTo64Bit(n), 31).toString()).toBe("8589934591");
    });
});

describe('calc.addSpace', () => {
    it('resizes number based on the space required', () => {
        const n8 = new Integer(1, 8);
        const n16 = new Integer(1, 16); 

        expect(calc.addSpace(n8, 0).maxBitSize).toBe(8);
        expect(calc.addSpace(n8, 1).maxBitSize).toBe(16);
        expect(calc.addSpace(n8, 9).maxBitSize).toBe(32);
        expect(calc.addSpace(n16, 1).maxBitSize).toBe(32);
        expect(calc.addSpace(n16, 32).maxBitSize).toBe(64);
    });
});

describe('calc.numberOfBitsDisplayed', () => {
    it('calculates number of bits', () => {
        expect(calc.numberOfBitsDisplayed(1)).toBe(1);
        expect(calc.numberOfBitsDisplayed(BigInt(-1))).toBe(32);
        expect(calc.numberOfBitsDisplayed(2)).toBe(2);
        expect(calc.numberOfBitsDisplayed(3)).toBe(2);
        expect(calc.numberOfBitsDisplayed(68719476735)).toBe(36);
        expect(calc.numberOfBitsDisplayed(INT32_MIN_VALUE-1)).toBe(64);
    });
});

describe('calc.lshift', () => {

    it("respects bit size", () => {
        expect(calc.lshift(new Integer(BigInt("0b0100"), 4), 2).num()).toBe(0);
    });

    it('transitions number to negative', ()=> {
        // 4-bit space
        expect(calc.lshift(new Integer(BigInt("0b0100"), 4), 1).num()).toBe(-8);
        
        // 5-bit space
        expect(calc.lshift(new Integer(BigInt("0b00100"), 5), 1).num()).toBe(8);
        expect(calc.lshift(new Integer(BigInt("0b01000"), 5), 1).num()).toBe(-16);

        // 32-bit
        expect(calc.lshift(new Integer(BigInt("2147483647"), 32), 1).num()).toBe(-2);
        expect(calc.lshift(new Integer(BigInt("2147483647"), 32), 2).num()).toBe(-4);

        // 64-bit
        expect(calc.lshift(new Integer(BigInt("9223372036854775807"), 64), 1).num()).toBe(-2);
        expect(calc.lshift(new Integer(BigInt("9223372036854775807"), 64), 2).num()).toBe(-4);
        expect(calc.lshift(new Integer(BigInt("2147483647"), 64), 1).value.toString()).toBe("4294967294");
        expect(calc.lshift(new Integer(BigInt("2147483647"), 64), 2).value.toString()).toBe("8589934588");
    });

    it('test', () => {
        const actual = calc.lshift(asInteger(100081515), 31).num();
        expect(actual).toBe(-2147483648);
    });

    it('1 to sign bit', () => {
        const actual = calc.lshift(asInteger(1), 31).num();
        expect(actual).toBe(-2147483648);
    });
});

describe("calc misc", () => {


    it('promoteTo64Bit', () => {
        const n = asInteger(-1);
        expect(calc.toBinaryString(calc.promoteTo64Bit(n))).toBe("11111111111111111111111111111111");
    });

    it('binaryRepresentation', () => {
        expect(calc.toBinaryString(asInteger(2147483647))).toBe("1111111111111111111111111111111");
    });

    it('not 64bit', () => {
        const actual = calc.not(asInteger("8920390230576132")).toString();
        expect(actual).toBe("-8920390230576133");
    });
});

describe("calc.engine.", () => {
    it("not", () => {
        expect(calc.engine.not("0101")).toBe("1010");
        expect(calc.engine.not("11111")).toBe("00000")
    });

    it("or", () => {
        expect(calc.engine.or("1", "1")).toBe("1");
        expect(calc.engine.or("1", "0")).toBe("1");
        expect(calc.engine.or("0", "0")).toBe("0");
        expect(calc.engine.or("10101", "01111")).toBe("11111");
    });

    it("and", () => {
        expect(calc.engine.and("1", "1")).toBe("1");
        expect(calc.engine.and("1", "0")).toBe("0");
        expect(calc.engine.and("0", "0")).toBe("0");
        expect(calc.engine.and("10101", "11011")).toBe("10001");
    });

    it("xor", () => {
        expect(calc.engine.xor("1", "1")).toBe("0");
        expect(calc.engine.xor("1", "0")).toBe("1");
        expect(calc.engine.xor("0", "0")).toBe("0");
        expect(calc.engine.xor("10101", "11011")).toBe("01110");
    });

    it("lshift", () => {
        expect(calc.engine.lshift("1", 1)).toBe("0");
        expect(calc.engine.lshift("01", 1)).toBe("10");
        expect(calc.engine.lshift("01101", 4)).toBe("10000");
        expect(calc.engine.lshift("000001", 4)).toBe("010000");
    });

    it("rshift", () => {
        expect(calc.engine.rshift("1", 1)).toBe("1");
        expect(calc.engine.rshift("01", 1)).toBe("00");
        expect(calc.engine.rshift("0101", 2)).toBe("0001");
        expect(calc.engine.rshift("1000", 3)).toBe("1111");
        expect(calc.engine.rshift("1101", 1)).toBe("1110");
    });

    it("urshift", () => {
        expect(calc.engine.urshift("1", 1)).toBe("0");
        expect(calc.engine.urshift("01", 1)).toBe("00");
        expect(calc.engine.urshift("0101", 2)).toBe("0001");
        expect(calc.engine.urshift("1000", 3)).toBe("0001");
        expect(calc.engine.urshift("1101", 1)).toBe("0110");
    });

    it('flipbit', () => {
        expect(calc.engine.flipBit("1", 0)).toBe("0");
        expect(calc.engine.flipBit("101", 1)).toBe("111");
    });

    it('applyTwosComplement', () => {
        expect(calc.engine.applyTwosComplement("010")).toBe("110");
        expect(calc.engine.applyTwosComplement("110")).toBe("010"); // reverse
        expect(calc.engine.applyTwosComplement("110")).toBe("010");
        expect(calc.engine.applyTwosComplement("0")).toBe("10");
        expect(calc.engine.applyTwosComplement("10101100")).toBe("01010100");
        expect(calc.engine.applyTwosComplement("01010100")).toBe("10101100"); // reverse
    });
})

describe("engine comparison", () => {
    
    it("NOT same as in node", () => {
        
        for(var i = -100; i<100;i++) {
            const expected = bin(~i);
            const actual = calc.engine.not(bin(i));
            expect(`${i} is ${actual}`).toBe(`${i} is ${(expected)}`);
        } 
    });

    it("OR same as in node", () => {
        for(var x = -100; x<100;x++) {
            const y = 5+3%x+x%6*(-x); 
            const expected = bin(x | y);
            const actual = calc.engine.or(bin(x), bin(y));

            expect(`${x} is ${actual}`).toBe(`${x} is ${(expected)}`);
        } 
    });

    it("AND same as in node", () => {
        for(var x = -100; x<100;x++) {
            const y = 5+3%x+x%6*(-x); 
            const expected = bin(x & y);
            const actual = calc.engine.and(bin(x), bin(y));

            expect(`${x} is ${actual}`).toBe(`${x} is ${(expected)}`);
        } 
    });

    function bin(i: number) {
        return (i >= 0 ? i : i >>> 0).toString(2).padStart(32, i<0 ? '1' : '0');
    }

});