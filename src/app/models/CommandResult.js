export default class CommandResult {
    constructor(input) {
        this.input = input;
        this.inputHash = this.encodeHash(input);
    }

    encodeHash (string) {
        return encodeURI(string.trim().replace(/\s/g,','));
    }
}