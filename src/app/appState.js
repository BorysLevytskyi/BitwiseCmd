class AppState {
    constructor() {
        this.emphasizeBytes = true;
        this.commandResults = [];
        this.handlers = [];
        this.uiTheme = 'dark'
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

    setUiTheme(theme) {
         this.uiTheme = theme;
         this.triggerChanged();    
    }
};

var appState = new AppState();
export default appState;
