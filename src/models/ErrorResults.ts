import CommandResult from './CommandResult';

export class UnhandledErrorResult extends CommandResult {
    error: Error;
    constructor(input: string, error : Error) {
        super(input);
        this.error = error;
    }
}

export class ErrorResult extends CommandResult {
    errorMessage: string;
    constructor(input: string, errorMessage : string) {
        super(input);
        this.errorMessage = errorMessage;
    }
}