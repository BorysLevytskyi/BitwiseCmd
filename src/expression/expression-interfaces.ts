import { ScalarExpression } from "./expression";

export interface ExpressionInput
{
    expressionString: string;
}

export interface Expression 
{
    isOperator: boolean;   
    getUnderlyingScalarOperand: () => ScalarExpression;
    evaluate(operand? : ScalarExpression): ScalarExpression;
}

export type NumberBase = 'dec' | 'hex' | 'bin';


