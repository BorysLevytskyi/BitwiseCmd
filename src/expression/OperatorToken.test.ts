import exp from "constants";
import BitwiseOperator from "./BitwiseOperator";
import ScalarValue from "./ScalarValue"

it('supports evaluation of big int', () => {
    const v = new ScalarValue(BigInt(1));
    const op = new BitwiseOperator(new ScalarValue(1), "<<");
    
    //const r = op.evaluate(v);
    //expect(r.isBigInt()).toBe(true);
    //expect(r.value.toString()).toBe("2");
})