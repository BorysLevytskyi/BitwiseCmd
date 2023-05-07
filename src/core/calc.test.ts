import calc from './calc';
import { BitwiseOperationExpression, ScalarToken, OperatorToken } from '../expression/expression';
import { INT_MAX_VALUE } from './const';

describe("calc", () => {
    it('calculates number of bits', () => {
        expect(calc.numberOfBitsDisplayed(1)).toBe(1);
        expect(calc.numberOfBitsDisplayed(2)).toBe(2);
        expect(calc.numberOfBitsDisplayed(3)).toBe(2);
        expect(calc.numberOfBitsDisplayed(68719476735)).toBe(36);
        expect(calc.numberOfBitsDisplayed(-INT_MAX_VALUE)).toBe(32);
        expect(calc.numberOfBitsDisplayed(-(INT_MAX_VALUE+1))).toBe(64);
    });
    
    it('calculates max number of bits', () => {
        expect(calc.maxNumberOfBitsDisplayed([1, 2, 3, 10])).toBe(4);
    });

    it('calculates expression', () => {
                
        var result = calc.calcExpression(new BitwiseOperationExpression(
            "1|2&3",
            [
                new ScalarToken(1),
                new OperatorToken(new ScalarToken(2), "|"),
                new OperatorToken(new ScalarToken(3), "&"),
            ]
        ));
        
        expect(result).toBe(3);
    });

    it('calculates flipped bit', () => {
        expect(calc.flippedBit("0", 31)).toBe(1);
        expect(calc.flippedBit("1", 31)).toBe(0);
        expect(calc.flippedBit("11111111111111111111111111111111", 31)).toBe(-2);
        expect(calc.flippedBit("01111111111111111111111111111111", 0)).toBe(-1);
        expect(calc.flippedBit("11111111111111111111111111111111", 0)).toBe(2147483647);
        expect(calc.flippedBit("01111111111111111111111111111111", 30)).toBe(2147483645);
    });

    it('applies twos complement', () => {
        expect(calc.applyTwosComplement("010")).toBe("110");
        expect(calc.applyTwosComplement("110")).toBe("010"); // reverse
        expect(calc.applyTwosComplement("110")).toBe("010");
        expect(calc.applyTwosComplement("0")).toBe("10");
        expect(calc.applyTwosComplement("10101100")).toBe("01010100");
        expect(calc.applyTwosComplement("01010100")).toBe("10101100"); // reverse
    });
});

describe("bitwise ", () => {


    it("NOT same as in node", () => {
        
        for(var i = -100; i<100;i++) {
            const expected = bin(~i);
            const actual = calc.bitwise.not(bin(i));
            expect(`${i} is ${actual}`).toBe(`${i} is ${(expected)}`);
        } 
    });

    it("OR same as in node", () => {
        for(var x = -100; x<100;x++) {
            const y = 5+3%x+x%6*(-x); 
            const expected = bin(x | y);
            const actual = calc.bitwise.or(bin(x), bin(y));

            expect(`${x} is ${actual}`).toBe(`${x} is ${(expected)}`);
        } 
    });

    it("AND same as in node", () => {
        for(var x = -100; x<100;x++) {
            const y = 5+3%x+x%6*(-x); 
            const expected = bin(x & y);
            const actual = calc.bitwise.and(bin(x), bin(y));

            expect(`${x} is ${actual}`).toBe(`${x} is ${(expected)}`);
        } 
    });

    function bin(i: number) {
        return (i >= 0 ? i : i >>> 0).toString(2).padStart(32, i<0 ? '1' : '0');
    }

});