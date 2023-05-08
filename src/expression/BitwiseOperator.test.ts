import ScalarValue from "./ScalarValue";
import BitwiseOperator from './BitwiseOperator';

it('can apply ~ operand', () => {
    var op = new ScalarValue(10, 'dec');
    var expr = new BitwiseOperator(op, "~");
    
    var result = expr.evaluate();
    expect(result.value).toBe(-11);
    expect(result.base).toBe('dec');
});

it('can apply & operand', () => {
    var op1 = new ScalarValue(3, 'dec');
    var op2 = new ScalarValue(4, 'dec');
    var expr = new BitwiseOperator(op1, "|");
    var result = expr.evaluate(op2);
    expect(result.value).toBe(7);
    expect(result.base).toBe('dec');
});