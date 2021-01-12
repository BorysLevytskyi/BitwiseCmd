import NumericOperand from "./NumericOperand";
import ExpressionOperand from './ExpressionOperand';

it('can apply ~ operand', () => {
    var op = new NumericOperand(10, 'dec');
    var expr = new ExpressionOperand("~10", op, "~");
    var result = expr.evaluate();
    expect(result.value).toBe(-11);
    expect(result.base).toBe('dec');
});

it('can apply & operand', () => {
    var op1 = new NumericOperand(3, 'dec');
    var op2 = new NumericOperand(4, 'dec');
    var expr = new ExpressionOperand("|3", op1, "|");
    var result = expr.evaluate(op2);
    expect(result.value).toBe(7);
    expect(result.base).toBe('dec');
});