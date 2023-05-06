import { Expression, ExpressionToken } from "./expression-interfaces";

export default class BitwiseOperationExpression implements Expression {
    
    expressionString: string;
    children: ExpressionToken[];

    constructor(expressionString: string, children: ExpressionToken[]) {
        this.expressionString = expressionString;
        this.children = children;
    }
}