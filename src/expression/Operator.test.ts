import Operand from "./Operand";
import Operator from './Operator';

it('can apply ~ operand', () => {
    var op = new Operand(10, 'dec');
    var expr = new Operator(op, "~");
    
    var result = expr.evaluate();
    expect(result.value.num()).toBe(-11);
    expect(result.base).toBe('dec');
});

it('can apply & operand', () => {
    var op1 = new Operand(3, 'dec');
    var op2 = new Operand(4, 'dec');
    var expr = new Operator(op1, "|");
    var result = expr.evaluate(op2);
    expect(result.value.num()).toBe(7);
    expect(result.base).toBe('dec');
});