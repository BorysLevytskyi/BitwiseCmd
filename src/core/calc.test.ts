import calc from './calc';
import { BitwiseOperationExpression, NumericOperand, ExpressionOperand } from '../expression/expression';
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
                new NumericOperand(1),
                new ExpressionOperand("|2", new NumericOperand(2), "|"),
                new ExpressionOperand("&3", new NumericOperand(3), "&"),
            ]
        ));
        
        expect(result).toBe(3);
    });
});