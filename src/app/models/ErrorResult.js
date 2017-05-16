import CommandResult from './CommandResult';

export default class ErrorResult extends CommandResult {
    constructor(input, error) {
        super(input);
        this.error = error;
    }
}