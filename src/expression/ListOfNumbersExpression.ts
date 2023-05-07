import calc from "../core/calc";
import ScalarValue from "./ScalarValue";
import { Expression, ExpressionElement } from "./expression-interfaces";

export default class ListOfNumbersExpression implements Expression {
    children: ScalarValue[];
    expressionString: string;
    maxBitsLength: number;

    constructor(expressionString: string, numbers: ScalarValue[]) {
        this.expressionString = expressionString;
        this.children = numbers;
        this.maxBitsLength = numbers.map(n => calc.numberOfBitsDisplayed(n.value)).reduce((n , c) => n >= c ? n : c, 0);
    }

    toString() {
        return this.children.map(n => n.value.toString()).join(' ');
    }
}