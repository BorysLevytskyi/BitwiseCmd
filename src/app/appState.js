class AppState {
    constructor() {
        this.emphasizeBytes = true;
        this.commandResults = [];
        this.handlers = [];
    }

    addCommandResult(result) {
        this.commandResults.unshift(result);
        this.triggerChanged();
    }

    clearCommmandResults() {
        this.commandResults = [];
        this.triggerChanged();
    }

    toggleEmphasizeBytes() {
        this.emphasizeBytes = !this.emphasizeBytes;
        this.triggerChanged();
    }

    onChange(handler) {
        this.handlers.push(handler);
    }

    triggerChanged() {
        for(var h of this.handlers) {
            h();
        }
    }
};

var appState = new AppState();
export default appState;
