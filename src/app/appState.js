export default class AppState {
    constructor(persistData) {
        this.emphasizeBytes = persistData.emphasizeBytes || true;
        this.commandResults = [];
        this.handlers = [];
        this.uiTheme = persistData.uiTheme || 'dark';
        this.debugMode = false;

        this.version = 1;
        this.persistedVersion = persistData.version || 0.9;
        this.wasOldVersion = this.version > this.persistedVersion;
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

    getPersistData() {
        return {
            emphasizeBytes: this.emphasizeBytes,
            uiTheme: this.uiTheme,
            version: this.version
        }
    }
};