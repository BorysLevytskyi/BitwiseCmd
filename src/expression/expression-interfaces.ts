import { NumericOperand } from "./expression";

export interface ExpressionInput
{
    expressionString: string;
}

export interface ExpressionInputItem 
{
    isExpression: boolean;   
    getUnderlyingOperand: () => NumericOperand;
    evaluate(operand? : NumericOperand): NumericOperand;
}

export type NumberBase = 'dec' | 'hex' | 'bin';


