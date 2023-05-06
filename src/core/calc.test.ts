import calc from './calc';
import { BitwiseOperationExpression, ScalarExpression, OperatorExpression } from '../expression/expression';
import exp from 'constants';

describe("calc", () => {
    it('calculates number of bits', () => {
        expect(calc.numberOfBits(1)).toBe(1);
        expect(calc.numberOfBits(2)).toBe(2);
        expect(calc.numberOfBits(3)).toBe(2);
        expect(calc.numberOfBits(68719476735)).toBe(36);
    });
    
    it('calculates max number of bits', () => {
        expect(calc.maxNumberOfBits([1, 2, 3, 10])).toBe(4);
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