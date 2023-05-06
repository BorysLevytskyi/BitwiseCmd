import ScalarExpression from "./ScalarExpression";
import OperatorExpression from './OperatorExpression';

it('can apply ~ operand', () => {
    var op = new ScalarExpression(10, 'dec');
    var expr = new OperatorExpression("~10", op, "~");
    var result = expr.evaluate();
    expect(result.value).toBe(-11);
    expect(result.base).toBe('dec');
});

it('can apply & operand', () => {
    var op1 = new ScalarExpression(3, 'dec');
    var op2 = new ScalarExpression(4, 'dec');
    var expr = new OperatorExpression("|3", op1, "|");
    var result = expr.evaluate(op2);
    expect(result.value).toBe(7);
    expect(result.base).toBe('dec');
});