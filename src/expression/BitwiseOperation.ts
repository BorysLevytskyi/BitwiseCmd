import { Expression, ExpressionElement } from "./expression-interfaces";

export default class BitwiseOperation implements Expression {
    
    expressionString: string;
    children: ExpressionElement[];

    constructor(expressionString: string, children: ExpressionElement[]) {
        this.expressionString = expressionString;
        this.children = children;
    }
}