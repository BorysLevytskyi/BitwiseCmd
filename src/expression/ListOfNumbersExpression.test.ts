import ScalarExpression from "./ScalarExpression";
import ListOfNumbersExpression from "./ListOfNumbersExpression";

it('calculates max bits length', () => {
    var expr = new ListOfNumbersExpression("10 0xabef 0b01010", [ScalarExpression.parse("10"), ScalarExpression.parse("0xabef"), ScalarExpression.parse("0b01010")])
    expect(expr.maxBitsLength).toBe(16);
});
