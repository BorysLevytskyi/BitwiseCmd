import CommandResult from './CommandResult';

export default class UnknownCommandResult extends CommandResult {
    constructor(input) {
        super(input);
        this.message = `Sorry, i don''t know what ${input} is :(`;
    }
}