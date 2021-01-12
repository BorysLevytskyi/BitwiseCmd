import CommandResult from './CommandResult';

export default class UnknownCommandResult extends CommandResult {
    message:string;
    constructor(input : string) {
        super(input);
        this.message = `Sorry, i don''t know what ${input} is :(`;
    }
}