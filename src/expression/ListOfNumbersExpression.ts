import calc from "../core/calc";
import ScalarExpression from "./ScalarExpression";
import { ExpressionInput, Expression } from "./expression-interfaces";

export default class ListOfNumbersExpression implements ExpressionInput {
    children: ScalarExpression[];
    expressionString: string;
    maxBitsLength: number;

    constructor(expressionString: string, numbers: ScalarExpression[]) {
        this.expressionString = expressionString;
        this.children = numbers;
        this.maxBitsLength = numbers.map(n => calc.numberOfBitsDisplayed(n.value)).reduce((n , c) => n >= c ? n : c, 0);
    }

    toString() {
        return this.children.map(n => n.value.toString()).join(' ');
    }
}