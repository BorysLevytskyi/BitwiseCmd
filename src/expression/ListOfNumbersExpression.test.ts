import NumericOperand from "./NumericOperand";
import ListOfNumbersExpression from "./ListOfNumbersExpression";

it('calculates max bits length', () => {
    var expr = new ListOfNumbersExpression("10 0xabef 0b01010", [NumericOperand.parse("10"), NumericOperand.parse("0xabef"), NumericOperand.parse("0b01010")])
    expect(expr.maxBitsLength).toBe(16);
});
