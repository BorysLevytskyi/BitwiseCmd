import calc from "../core/calc";
import Operand from "./Operand";
import { Expression } from "./expression-interfaces";

export default class ListOfNumbers implements Expression {
    children: Operand[];
    expressionString: string;
    maxBitsLength: number;

    constructor(expressionString: string, numbers: Operand[]) {
        this.expressionString = expressionString;
        this.children = numbers;
        this.maxBitsLength = numbers.map(n => calc.numberOfBitsDisplayed(n.value)).reduce((n , c) => n >= c ? n : c, 0);
    }

    toString() {
        return this.children.map(n => n.value.toString()).join(' ');
    }
}