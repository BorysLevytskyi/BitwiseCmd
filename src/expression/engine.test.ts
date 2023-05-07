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

    it('allows second operator to be a number when shifting big-int', () => {
        const a = new ScalarToken(BigInt(1));
        const b = new ScalarToken(1);
        
        const rshift = engine.applyOperator(a, ">>", b);
        expect(rshift.isBigInt()).toBe(true);
        expect(rshift.value.toString()).toBe('0');

        const lshift = engine.applyOperator(a, "<<", b);
        expect(lshift.isBigInt()).toBe(true);
        expect(lshift.value.toString()).toBe('2');
    })

});