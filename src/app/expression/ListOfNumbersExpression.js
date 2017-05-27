export default class ListOfNumbersExpression {
    constructor(expressionString, numbers) {
        this.expressionString = expressionString;
        this.numbers = numbers;
        this.maxBitsLegnth = numbers.map(n => n.lengthInBits).reduce((n , c) => n >= c ? n : c, 0);
    }

    toString() {
        return this.numbers.map(n => n.value.toString()).join(' ');
    }
}