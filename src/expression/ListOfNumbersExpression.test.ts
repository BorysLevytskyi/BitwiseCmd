import ScalarValue from "./ScalarValue";
import ListOfNumbersExpression from "./ListOfNumbersExpression";
import { numberParser } from "./numberParser";

it('calculates max bits length', () => {
    const v1 = new ScalarValue(numberParser.parse("10").value);
    const v2 = new ScalarValue(numberParser.parse("0xabef").value);
    const v3 = new ScalarValue(numberParser.parse("0b01010").value);

    var expr = new ListOfNumbersExpression("10 0xabef 0b01010", [v1, v2, v3])
    expect(expr.maxBitsLength).toBe(16);
});
