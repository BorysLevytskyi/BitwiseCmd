import ScalarValue from "./ScalarValue";
import engine from "./engine";

describe('evaluate', () => {

    it('treats differently big ints and regular numbers', () => {
        const bigResult = engine.applyOperator(new ScalarValue({value: BigInt(2147483647), maxBitSize: 64}), "<<", new ScalarValue(BigInt(1)));
        const result = engine.applyOperator(new ScalarValue({value: BigInt(2147483647), maxBitSize: 32}), "<<", new ScalarValue(1));

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