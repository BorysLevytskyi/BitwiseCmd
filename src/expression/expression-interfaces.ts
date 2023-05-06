import { ScalarToken } from "./expression";

export interface Expression
{
    expressionString: string;
}

export interface ExpressionToken 
{
    isOperator: boolean;   
    getUnderlyingScalarOperand: () => ScalarToken;
    evaluate(operand? : ScalarToken): ScalarToken;
}

