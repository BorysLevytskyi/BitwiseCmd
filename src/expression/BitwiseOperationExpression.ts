import { ExpressionInput, Expression } from "./expression-interfaces";

export default class BitwiseOperationExpression implements ExpressionInput {
    
    expressionString: string;
    children: Expression[];

    constructor(expressionString: string, children: Expression[]) {
        this.expressionString = expressionString;
        this.children = children;
    }
}