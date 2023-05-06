import calc from './calc';
import { BitwiseOperationExpression, ScalarExpression, OperatorExpression } from '../expression/expression';
import exp from 'constants';
import { INT_MAX_VALUE } from './const';
import formatter from './formatter';

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
                new ScalarExpression(1),
                new OperatorExpression(new ScalarExpression(2), "|"),
                new OperatorExpression(new ScalarExpression(3), "&"),
            ]
        ));
        
        expect(result).toBe(3);
    });
});

describe("binary ", () => {


    it("bitwise NOT same as in node", () => {
        
        for(var i = -100; i<100;i++) {
            const expected = bin(~i);
            const actual = calc.bitwise.not(bin(i));
            expect(`${i} is ${actual}`).toBe(`${i} is ${(expected)}`);
        } 
    });

    it("bitwise OR same as in node", () => {
        for(var x = -100; x<100;x++) {
            const y = 5+3%x+x%6*(-x); 
            const expected = bin(x | y);
            const actual = calc.bitwise.or(bin(x), bin(y));

            expect(`${x} is ${actual}`).toBe(`${x} is ${(expected)}`);
        } 
    });

    it("bitwise AND same as in node", () => {
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