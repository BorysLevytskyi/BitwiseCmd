import CommandResult from './CommandResult';

export default class ErrorResult extends CommandResult {
    error: Error;
    constructor(input: string, error : Error) {
        super(input);
        this.error = error;
    }
}