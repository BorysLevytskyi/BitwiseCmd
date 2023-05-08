import { ScalarValue } from "./expression";

export interface Expression
{
    expressionString: string;
}

export interface ExpressionElement 
{
    isOperator: boolean;   
    getUnderlyingScalarOperand: () => ScalarValue;
    evaluate(operand? : ScalarValue): ScalarValue;
}

