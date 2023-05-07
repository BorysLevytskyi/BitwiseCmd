import ScalarToken from "./ScalarToken";
import engine from "./engine";

describe('evaluate', () => {

    it('treats differently big ints and regular numbers', () => {
        const bigResult = engine.applyOperator(new ScalarToken(BigInt(2147483647)), "<<", new ScalarToken(BigInt(1)));
        const result = engine.applyOperator(new ScalarToken(2147483647), "<<", new ScalarToken(1));

        expect(bigResult.value.toString()).toBe("4294967294");
        expect(result.value.toString()).toBe("-2");
    });

    it("can execute all operators without errors", () => {

        const operators = [">>", "<<", "|", "&", "^"];

        // >>> not supported by BigInt
        expect(() => engine.applyOperator(new ScalarToken(1),  ">>>", new ScalarToken(2))).not.toThrow();

        operators.forEach(o => {
            expect(() => engine.applyOperator(new ScalarToken(BigInt(1)), o, new ScalarToken(BigInt(2)))).not.toThrow();
            expect(() => engine.applyOperator(new ScalarToken(1), o, new ScalarToken(2))).not.toThrow();
        });
        
    });

    it('throws whne mixing numbers in big ints', () => {
        expect(() => engine.applyOperator(new ScalarToken(BigInt(1)), "<<", new ScalarToken(1))).toThrowError("Cannot mix BigInt and other types, use explicit conversions")
    });
});