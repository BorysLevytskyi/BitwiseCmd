import log from 'loglevel';

export type PersistedAppData = {
    emphasizeBytes: boolean;
    uiTheme: string;
    version: number;
    debugMode: boolean | null;
}

export type AppStateChangeHandler = (state: AppState) => void;

export default class AppState {

    version: number = 4;
    emphasizeBytes: boolean;
    debugMode: boolean = false;
    uiTheme: string;
    handlers: AppStateChangeHandler[];
    commandResults: any[];
    persistedVersion: number;
    wasOldVersion: boolean;
    env: string;    

    constructor(persistData : PersistedAppData, env: string) {
        this.commandResults = [];
        this.handlers = [];
        this.uiTheme = persistData.uiTheme || 'midnight';
        this.env = env;

        this.emphasizeBytes = persistData.emphasizeBytes || true;
        this.persistedVersion = persistData.version || 0.1;
        this.wasOldVersion = persistData.version != null && this.version > this.persistedVersion;
        this.debugMode = env !== 'prod' || persistData.debugMode === true;
    }

    addCommandResult(result : any) {
        this.commandResults.unshift(result);
        log.debug("result added", result);
        this.triggerChanged();
    }

    clearCommandResults() {
        this.commandResults = [];
        this.triggerChanged();
    }

    toggleEmphasizeBytes() {
        this.emphasizeBytes = !this.emphasizeBytes;
        this.triggerChanged();
    }

    onChange(handler : AppStateChangeHandler) {
        this.handlers.push(handler);
    }

    triggerChanged() {
        this.handlers.forEach(h => h(this));
    }

    setUiTheme(theme: string) {
         this.uiTheme = theme;
         this.triggerChanged();    
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        this.triggerChanged();
    }

    getPersistData() : PersistedAppData {
        return {
            emphasizeBytes: this.emphasizeBytes,
            uiTheme: this.uiTheme,
            version: this.version,
            debugMode: this.debugMode
        }
    }
};