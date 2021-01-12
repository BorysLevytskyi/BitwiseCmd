import CommandResult from './CommandResult';
import { ExpressionInput } from '../expression/expression-interfaces';

export default class ExpressionResult extends CommandResult {
    expression: ExpressionInput;
    constructor(input: string, expression: ExpressionInput) {
        super(input);
        this.expression = expression;
    }
}