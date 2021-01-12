export default class CommandResult {
    input: string;
    inputHash: string;

    constructor(input: string) {
        this.input = input;
        this.inputHash = this.encodeHash(input);
    }

    encodeHash (input: string) {
        return encodeURI(input.trim().replace(/\s/g,','));
    }
}