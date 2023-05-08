import { BoundedInt } from "../core/types";
import ScalarValue from "./ScalarValue";
import engine from "./engine";

describe('evaluate', () => {

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
});