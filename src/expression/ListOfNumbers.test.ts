import Operand from "./Operand";
import ListOfNumbers from "./ListOfNumbers";
import { numberParser } from "./numberParser";

it('calculates max bits length', () => {
    const v1 = new Operand(numberParser.parse("10").value);
    const v2 = new Operand(numberParser.parse("0xabef").value);
    const v3 = new Operand(numberParser.parse("0b01010").value);

    var expr = new ListOfNumbers("10 0xabef 0b01010", [v1, v2, v3])
    expect(expr.maxBitsLength).toBe(16);
});
