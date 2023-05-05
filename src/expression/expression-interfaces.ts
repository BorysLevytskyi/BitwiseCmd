import { ScalarOperand } from "./expression";

export interface ExpressionInput
{
    expressionString: string;
}

export interface ExpressionInputItem 
{
    isExpression: boolean;   
    getUnderlyingOperand: () => ScalarOperand;
    evaluate(operand? : ScalarOperand): ScalarOperand;
}

export type NumberBase = 'dec' | 'hex' | 'bin';


