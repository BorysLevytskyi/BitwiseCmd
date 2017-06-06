import CommandResult from './CommandResult';

export default class StringResult extends CommandResult {
    constructor(input, text) {
        super(input);
        this.value = text;
    }
}