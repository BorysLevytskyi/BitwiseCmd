import log from 'loglevel';

export const APP_VERSION = 9;

export type PersistedAppData = {
    emphasizeBytes: boolean;
    uiTheme: string;
    version: number | null;
    debugMode: boolean | null;
    pageVisistsCount: number;
    donationClicked: boolean;
    annotateTypes: boolean;
    dimExtrBits: boolean;
}

export type CommandResultView = {
    key: number,
    input: string,
    view: ViewFactory
};

export type AppStateChangeHandler = (state: AppState) => void;

type ViewFactory = () => JSX.Element;

export default class AppState {

    version: number = APP_VERSION;
    emphasizeBytes: boolean;
    debugMode: boolean = false;
    uiTheme: string = 'midnight';
    changeHandlers: AppStateChangeHandler[] = [];
    commandResults: CommandResultView[] = [];
    persistedVersion: number;
    wasOldVersion: boolean;
    env: string;
    pageVisitsCount: number;
    donationClicked: boolean;
    showSettings: boolean = false;
    annotateTypes: boolean = false;
    dimExtraBits: boolean = false;

    constructor(persistData: PersistedAppData, env: string) {

        this.env = env;

        this.emphasizeBytes = !!persistData.emphasizeBytes;
        this.persistedVersion = persistData.version || 0.1;
        this.wasOldVersion = persistData.version != null && this.version > this.persistedVersion;
        this.debugMode = persistData.debugMode === true;
        this.pageVisitsCount = persistData.pageVisistsCount || 0;
        this.donationClicked = persistData.donationClicked;
        this.annotateTypes = !!persistData.annotateTypes;
        this.dimExtraBits = !!persistData.dimExtrBits;
    }

    addCommandResult(input: string, view: ViewFactory) {
        const key = generateKey();
        this.commandResults.unshift({ key, input, view });
        log.debug(`command result added: ${input}`);
        this.triggerChanged();
    }

    clearCommandResults() {
        this.commandResults = [];
        this.triggerChanged();
    }

    removeResult(index: number) {
        if (index < 0 || index >= this.commandResults.length)
            return;

        this.commandResults.splice(index, 1);
        this.triggerChanged();
    }

    toggleEmphasizeBytes(value?: boolean) {
        this.emphasizeBytes = value != null ? value : !this.emphasizeBytes;
        this.triggerChanged();
    }

    onChange(handler: AppStateChangeHandler) {
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

    toggleShowSettings() {
        this.showSettings = !this.showSettings;
        this.triggerChanged();
    }

    toggleAnnotateTypes(value?: boolean) {
        this.annotateTypes = value != null ? value : !this.annotateTypes;
        this.triggerChanged();
    }

    toggleDimExtrBits() {
        this.dimExtraBits = !this.dimExtraBits;
        this.triggerChanged();
    }

    registerVisit() {
        this.pageVisitsCount++;
        this.triggerChanged();
    }

    onDonationClicked(): boolean {
        if (this.donationClicked === true) return false;

        this.donationClicked = true;
        this.triggerChanged();
        return true;
    }

    getPersistData(): PersistedAppData {
        return {
            emphasizeBytes: this.emphasizeBytes,
            uiTheme: this.uiTheme,
            version: this.version,
            debugMode: this.debugMode,
            pageVisistsCount: this.pageVisitsCount,
            donationClicked: this.donationClicked,
            annotateTypes: this.annotateTypes,
            dimExtrBits: this.dimExtraBits
        }
    }
};

function generateKey(): number {
    return Math.ceil(Math.random() * 10000000) ^ Date.now(); // Because why the hell not...
}