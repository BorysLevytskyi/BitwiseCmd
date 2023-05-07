import ScalarToken from "./ScalarToken";
import OperatorToken from './OperatorToken';
import { INT32_MAX_VALUE } from "../core/const";

it('can apply ~ operand', () => {
    var op = new ScalarToken(10, 'dec');
    var expr = new OperatorToken(op, "~");
    
    var result = expr.evaluate();
    expect(result.value).toBe(-11);
    expect(result.base).toBe('dec');
});

it('can apply & operand', () => {
    var op1 = new ScalarToken(3, 'dec');
    var op2 = new ScalarToken(4, 'dec');
    var expr = new OperatorToken(op1, "|");
    var result = expr.evaluate(op2);
    expect(result.value).toBe(7);
    expect(result.base).toBe('dec');
});