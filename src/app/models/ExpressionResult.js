import CommandResult from './CommandResult';

export default class ExpressionResult extends CommandResult {
    constructor(input, expression) {
        super(input);
        this.expression = expression;
    }
}