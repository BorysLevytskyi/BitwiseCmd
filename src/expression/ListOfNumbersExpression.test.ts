import ScalarOperand from "./ScalarOperand";
import ListOfNumbersExpression from "./ListOfNumbersExpression";

it('calculates max bits length', () => {
    var expr = new ListOfNumbersExpression("10 0xabef 0b01010", [ScalarOperand.parse("10"), ScalarOperand.parse("0xabef"), ScalarOperand.parse("0b01010")])
    expect(expr.maxBitsLength).toBe(16);
});
