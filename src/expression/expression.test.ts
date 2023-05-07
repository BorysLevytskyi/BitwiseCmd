import { parser, ListOfNumbersExpression, BitwiseOperationExpression, ScalarToken, OperatorToken } from "./expression";

describe("expression parser", () => {

    it("pares list of number expression", () => {
        var result = parser.parse("1 2 3");
        expect(result).toBeInstanceOf(ListOfNumbersExpression);
    });

    it("doesn't list of numbers in case of bad numbers", () => {
        expect(parser.parse("1 2 z")).toBeNull();
        //expect(parser.parse("-")).toBeNull();
        expect(parser.parse("")).toBeNull();
    });

    it("pares different operations expressions", () => {
        expect(parser.parse("~1")).toBeInstanceOf(BitwiseOperationExpression);
        expect(parser.parse("1^2")).toBeInstanceOf(BitwiseOperationExpression);
        expect(parser.parse("1|2")).toBeInstanceOf(BitwiseOperationExpression);
    });

    it("parses big binary bitwise expression", () => {
        const input = "0b00010010001101000101011001111000 0b10101010101010101010101000000000";
        const actual = parser.parse(input);
        expect(actual).toBeInstanceOf(ListOfNumbersExpression);

        const expr = actual as ListOfNumbersExpression;
        expect(expr.children[0].getUnderlyingScalarOperand().value.toString()).toBe('305419896');
        expect(expr.children[1].getUnderlyingScalarOperand().value.toString()).toBe('2863311360');
    })

    it("pares multiple operand expression", () => {       
        const result = parser.parse("1^2") as BitwiseOperationExpression;
        expect(result.children.length).toBe(2);

        const first = result.children[0];
        const second = result.children[1];

        expect(first).toBeInstanceOf(ScalarToken);

        expect((first as ScalarToken).value).toBe(1);

        expect(second).toBeInstanceOf(OperatorToken);
        var secondOp = second as OperatorToken;
        expect(secondOp.operator).toBe("^");

        expect(secondOp.operand).toBeInstanceOf(ScalarToken);
        var childOp = secondOp.operand as ScalarToken;
        expect(childOp.value.toString()).toBe('2');
    });

    it("bug", () => {       
        var result = parser.parse("1|~2") as BitwiseOperationExpression;
        expect(result.children.length).toBe(2);
    });
})