import ScalarValue from "./ScalarValue";
import ListOfNumbersExpression from "./ListOfNumbersExpression";

it('calculates max bits length', () => {
    var expr = new ListOfNumbersExpression("10 0xabef 0b01010", [ScalarValue.parse("10"), ScalarValue.parse("0xabef"), ScalarValue.parse("0b01010")])
    expect(expr.maxBitsLength).toBe(16);
});
