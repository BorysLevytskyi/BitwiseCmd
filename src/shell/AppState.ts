import log from 'loglevel';

const APP_VERSION = 6;

export type PersistedAppData = {
    emphasizeBytes: boolean;
    uiTheme: string;
    version: number;
    debugMode: boolean | null;
    pageVisistsCount: number;
}

export type CommandResultView = {
    key: number,
    input: string,
    view: JSX.Element
};

export type AppStateChangeHandler = (state: AppState) => void;

export default class AppState {

    version: number = APP_VERSION;
    emphasizeBytes: boolean;
    debugMode: boolean = false;
    uiTheme: string;
    changeHandlers: AppStateChangeHandler[];
    commandResults: CommandResultView[];
    persistedVersion: number;
    wasOldVersion: boolean;
    env: string;
    pageVisitsCount: number;

    constructor(persistData : PersistedAppData, env: string) {
        this.commandResults = [];
        this.changeHandlers = [];
        this.uiTheme = persistData.uiTheme || 'midnight';
        this.env = env;

        this.emphasizeBytes = persistData.emphasizeBytes || true;
        this.persistedVersion = persistData.version || 0.1;
        this.wasOldVersion = persistData.version != null && this.version > this.persistedVersion;
        this.debugMode = env !== 'prod' || persistData.debugMode === true;
        this.pageVisitsCount = persistData.pageVisistsCount || 0;
    }

    addCommandResult(input : string, view : JSX.Element) {
        const key = generateKey();
        this.commandResults.unshift({key, input, view});
        log.debug(`command result added: ${input}`);
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
        this.changeHandlers.push(handler);
    }

    triggerChanged() {
        this.changeHandlers.forEach(h => h(this));
    }

    setUiTheme(theme: string) {
         this.uiTheme = theme;
         this.triggerChanged();    
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        this.triggerChanged();
    }

    registerVisit() {
        this.pageVisitsCount++;
        this.triggerChanged();
    }

    getPersistData() : PersistedAppData {
        return {
            emphasizeBytes: this.emphasizeBytes,
            uiTheme: this.uiTheme,
            version: this.version,
            debugMode: this.debugMode,
            pageVisistsCount: this.pageVisitsCount
        }
    }
};

function generateKey() : number {
    return Math.ceil(Math.random()*10000000) ^ Date.now(); // Because why the hell not...
}