import NumericOperand from "./NumericOperand";
import { ExpressionInput, ExpressionInputItem } from "./expression-interfaces";

export default class ListOfNumbersExpression implements ExpressionInput {
    numbers: NumericOperand[];
    expressionString: string;
    maxBitsLength: number;

    constructor(expressionString: string, numbers: NumericOperand[]) {
        this.expressionString = expressionString;
        this.numbers = numbers;
        this.maxBitsLength = numbers.map(n => n.lengthInBits).reduce((n , c) => n >= c ? n : c, 0);
    }

    toString() {
        return this.numbers.map(n => n.value.toString()).join(' ');
    }
}