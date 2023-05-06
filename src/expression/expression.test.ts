import { OperationCanceledException } from "typescript";
import { parser, ListOfNumbersExpression, BitwiseOperationExpression, ScalarExpression, OperatorExpression } from "./expression";

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
        const input = "0b00010010001101000101011001111000 | 0b10101010101010101010101000000000";
        const actual = parser.parse(input);
        expect(actual).toBeInstanceOf(BitwiseOperationExpression);

        const expr = actual as BitwiseOperationExpression;
        expect(expr.children[0].getUnderlyingScalarOperand().value).toBe(305419896);
        expect(expr.children[1].getUnderlyingScalarOperand().value).toBe(2863311360);
    })

    it("pares multiple operand expression", () => {       
        const result = parser.parse("1^2") as BitwiseOperationExpression;
        expect(result.children.length).toBe(2);

        const first = result.children[0];
        const second = result.children[1];

        expect(first).toBeInstanceOf(ScalarExpression);

        expect((first as ScalarExpression).value).toBe(1);

        expect(second).toBeInstanceOf(OperatorExpression);
        var secondOp = second as OperatorExpression;
        expect(secondOp.sign).toBe("^");

        expect(secondOp.operand).toBeInstanceOf(ScalarExpression);
        var childOp = secondOp.operand as ScalarExpression;
        expect(childOp.value).toBe(2);
    });

    it("bug", () => {       
        var result = parser.parse("1|~2") as BitwiseOperationExpression;
        expect(result.children.length).toBe(2);
    });
})