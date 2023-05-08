import { Expression, ExpressionElement } from "./expression-interfaces";

export default class BitwiseOperationExpression implements Expression {
    
    expressionString: string;
    children: ExpressionElement[];

    constructor(expressionString: string, children: ExpressionElement[]) {
        this.expressionString = expressionString;
        this.children = children;
    }
}