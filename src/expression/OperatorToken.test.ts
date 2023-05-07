import exp from "constants";
import OperatorToken from "./OperatorToken";
import ScalarToken from "./ScalarToken"

it('supports evaluation of big int', () => {
    const v = new ScalarToken(BigInt(1));
    const op = new OperatorToken(new ScalarToken(1), "<<");
    
    //const r = op.evaluate(v);
    //expect(r.isBigInt()).toBe(true);
    //expect(r.value.toString()).toBe("2");
})