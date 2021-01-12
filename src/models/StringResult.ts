import CommandResult from './CommandResult';

export default class StringResult extends CommandResult {
    value:string;
    constructor(input: string, value : string) {
        super(input);
        this.value = value;
    }
}