import ScalarToken from "./ScalarToken";
import ListOfNumbersExpression from "./ListOfNumbersExpression";

it('calculates max bits length', () => {
    var expr = new ListOfNumbersExpression("10 0xabef 0b01010", [ScalarToken.parse("10"), ScalarToken.parse("0xabef"), ScalarToken.parse("0b01010")])
    expect(expr.maxBitsLength).toBe(16);
});
