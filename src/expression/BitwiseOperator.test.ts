import ScalarValue from "./ScalarValue";
import BitwiseOperator from './BitwiseOperator';

it('can apply ~ operand', () => {
    var op = new ScalarValue(10, 'dec');
    var expr = new BitwiseOperator(op, "~");
    
    var result = expr.evaluate();
    expect(result.value.num()).toBe(-11);
    expect(result.base).toBe('dec');
});

it('can apply & operand', () => {
    var op1 = new ScalarValue(3, 'dec');
    var op2 = new ScalarValue(4, 'dec');
    var expr = new BitwiseOperator(op1, "|");
    var result = expr.evaluate(op2);
    expect(result.value.num()).toBe(7);
    expect(result.base).toBe('dec');
});

it('treats differently big ints and regular numbers', () => {
    const one = new BoundedInt(1);
    const n64 = new BoundedInt(2147483647, 64);
    const n32 = new BoundedInt(2147483647, 32);

    const bigResult = engine.applyOperator(new ScalarValue(n64), "<<", new ScalarValue(one));
    const result = engine.applyOperator(new ScalarValue(n32), "<<", new ScalarValue(one));

    expect(bigResult.value.toString()).toBe("4294967294");
    expect(result.value.toString()).toBe("-2");
});

it("can execute all operators without errors", () => {

    const operators = [">>", "<<", "|", "&", "^"];

    // >>> not supported by BigInt
    expect(() => engine.applyOperator(new ScalarValue(1),  ">>>", new ScalarValue(2))).not.toThrow();

    operators.forEach(o => {
        expect(() => engine.applyOperator(new ScalarValue(BigInt(1)), o, new ScalarValue(BigInt(2)))).not.toThrow();
        expect(() => engine.applyOperator(new ScalarValue(1), o, new ScalarValue(2))).not.toThrow();
    });
    
});