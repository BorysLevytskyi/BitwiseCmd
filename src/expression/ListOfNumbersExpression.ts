import calc from "../core/calc";
import ScalarToken from "./ScalarToken";
import { Expression, ExpressionToken } from "./expression-interfaces";

export default class ListOfNumbersExpression implements Expression {
    children: ScalarToken[];
    expressionString: string;
    maxBitsLength: number;

    constructor(expressionString: string, numbers: ScalarToken[]) {
        this.expressionString = expressionString;
        this.children = numbers;
        this.maxBitsLength = numbers.map(n => calc.numberOfBitsDisplayed(n.value)).reduce((n , c) => n >= c ? n : c, 0);
    }

    toString() {
        return this.children.map(n => n.value.toString()).join(' ');
    }
}