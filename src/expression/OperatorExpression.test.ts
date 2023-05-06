import ScalarExpression from "./ScalarExpression";
import OperatorExpression from './OperatorExpression';
import { INT_MAX_VALUE } from "../core/const";

it('can apply ~ operand', () => {
    var op = new ScalarExpression(10, 'dec');
    var expr = new OperatorExpression(op, "~");
    var result = expr.evaluate();
    expect(result.value).toBe(-11);
    expect(result.base).toBe('dec');
});

it('can apply & operand', () => {
    var op1 = new ScalarExpression(3, 'dec');
    var op2 = new ScalarExpression(4, 'dec');
    var expr = new OperatorExpression(op1, "|");
    var result = expr.evaluate(op2);
    expect(result.value).toBe(7);
    expect(result.base).toBe('dec');
});

it("doesn't support opreations with numbers larger than 32-bit", () => {
    expect(() => new OperatorExpression(new ScalarExpression(2147483648), "^"))
        .toThrowError("2147483648 has more than 32 bits. JavaScript converts all numbers to 32-bit integers when applying bitwise operators. BitwiseCmd currently uses the JavaScript engine of your browser for results calculation and supports numbers in the range from -2147483647 to 2147483647");
});