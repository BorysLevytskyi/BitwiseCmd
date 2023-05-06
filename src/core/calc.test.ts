import calc from './calc';
import { BitwiseOperationExpression, ScalarExpression, OperatorExpression } from '../expression/expression';
import exp from 'constants';
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
                new ScalarExpression(1),
                new OperatorExpression("|2", new ScalarExpression(2), "|"),
                new OperatorExpression("&3", new ScalarExpression(3), "&"),
            ]
        ));
        
        expect(result).toBe(3);
    });
});