import { Operand } from "./expression";

export interface Expression
{
    expressionString: string;
}

export interface ExpressionElement 
{
    isOperator: boolean;   
    getUnderlyingOperand: () => Operand;
    evaluate(operand? : Operand): Operand;
}

