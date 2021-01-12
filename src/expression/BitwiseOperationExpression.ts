import { ExpressionInput, ExpressionInputItem } from "./expression-interfaces";

export default class BitwiseOperationExpression implements ExpressionInput {
    
    expressionString: string;
    expressionItems: ExpressionInputItem[];

    constructor(expressionString: string, expressions: ExpressionInputItem[]) {
        this.expressionString = expressionString;
        this.expressionItems = expressions;
    }
}