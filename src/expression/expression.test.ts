import { OperationCanceledException } from "typescript";
import { parser, ListOfNumbersExpression, BitwiseOperationExpression, NumericOperand, ExpressionOperand } from "./expression";

describe("expression parser", () => {

    it("pares list of number expression", () => {
        var result = parser.parse("1 2 3");
        expect(result).toBeInstanceOf(ListOfNumbersExpression);
    });

    it("pares different operations expressions", () => {
        expect(parser.parse("~1")).toBeInstanceOf(BitwiseOperationExpression);
        expect(parser.parse("1^2")).toBeInstanceOf(BitwiseOperationExpression);
        expect(parser.parse("1|2")).toBeInstanceOf(BitwiseOperationExpression);
    });

    it("pares multiple operand expression", () => {       
        const result = parser.parse("1^2") as BitwiseOperationExpression;
        expect(result.expressionItems.length).toBe(2);

        const first = result.expressionItems[0];
        const second = result.expressionItems[1];

        expect(first).toBeInstanceOf(NumericOperand);

        expect((first as NumericOperand).value).toBe(1);

        expect(second).toBeInstanceOf(ExpressionOperand);
        var secondOp = second as ExpressionOperand;
        expect(secondOp.sign).toBe("^");

        expect(secondOp.operand).toBeInstanceOf(NumericOperand);
        var childOp = secondOp.operand as NumericOperand;
        expect(childOp.value).toBe(2);
    });

    it("bug", () => {       
        var result = parser.parse("1|~2") as BitwiseOperationExpression;
        expect(result.expressionItems.length).toBe(2);
    });
})