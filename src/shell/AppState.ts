import log from 'loglevel';

export const APP_VERSION = 11;

export type PersistedAppData = {
    emphasizeBytes: boolean;
    uiTheme: string;
    version: number | null;
    debugMode: boolean | null;
    pageVisitsCount: number;
    donationClicked: boolean;
    annotateTypes: boolean;
    dimExtraBits: boolean;
    cookieDisclaimerHidden: boolean,
    centeredLayout?: boolean
}

export type CommandResultView = {
    key: number,
    input: string,
    view: ViewFactory
};

export type AppStateAttribute = keyof AppState;
export type AppStateChangeHandler = (state: AppState, attribute : AppStateAttribute) => void;

type ViewFactory = () => JSX.Element;

export default class AppState {

    version: number = APP_VERSION;
    emphasizeBytes: boolean;
    debugMode: boolean = false;
    uiTheme: string;
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
    cookieDisclaimerHidden: boolean = false;
    centeredLayout: boolean = true;

    constructor(persistData: PersistedAppData, env: string) {

        this.env = env;

        this.uiTheme = normalizeTheme(persistData.uiTheme);
        this.emphasizeBytes = !!persistData.emphasizeBytes;
        this.persistedVersion = persistData.version || 0.1;
        this.wasOldVersion = persistData.version !== null && persistData.version !== undefined && this.version > this.persistedVersion;
        this.debugMode = persistData.debugMode === true;
        this.pageVisitsCount = persistData.pageVisitsCount || 0;
        this.donationClicked = persistData.donationClicked;
        this.annotateTypes = !!persistData.annotateTypes;
        this.dimExtraBits = !!persistData.dimExtraBits;
        this.cookieDisclaimerHidden = !!persistData.cookieDisclaimerHidden
        this.centeredLayout = (persistData.centeredLayout === undefined) ? true : !!persistData.centeredLayout;
    }

    addCommandResult(input: string, view: ViewFactory) {
        const key = generateKey();
        this.commandResults.unshift({ key, input, view });
        log.debug(`command result added: ${input}`);
        this.triggerChanged('commandResults');
    }

    clearCommandResults() {
        this.commandResults = [];
        this.triggerChanged('commandResults');
    }

    removeResult(index: number) {
        if (index < 0 || index >= this.commandResults.length)
            return;

        this.commandResults.splice(index, 1);
        this.triggerChanged('commandResults');
    }

    toggleEmphasizeBytes(value?: boolean) {
        this.emphasizeBytes = value !== null && value !== undefined ? value : !this.emphasizeBytes;
        this.triggerChanged('emphasizeBytes');
    }

    onChange(handler: AppStateChangeHandler) {
        this.changeHandlers.push(handler);
    }

    triggerChanged(attribute: AppStateAttribute) {
        this.changeHandlers.forEach(h => h(this, attribute));
    }

    setUiTheme(theme: string) {
        
        const normalized = normalizeTheme(theme);

        if(this.uiTheme === normalized) 
            return;

        this.uiTheme = normalized;
        this.triggerChanged('uiTheme');
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        this.triggerChanged('debugMode');
    }

    toggleShowSettings() {
        this.showSettings = !this.showSettings;
        this.triggerChanged('showSettings');
    }

    toggleAnnotateTypes(value?: boolean) {
        this.annotateTypes = value !== null && value !== undefined ? value : !this.annotateTypes;
        this.triggerChanged('annotateTypes');
    }

    toggleDimExtraBits() {
        this.dimExtraBits = !this.dimExtraBits;
        this.triggerChanged('dimExtraBits');
    }

    toggleCenteredLayout(value?: boolean) {
        this.centeredLayout = value !== null && value !== undefined ? value : !this.centeredLayout;
        this.triggerChanged('centeredLayout');
    }

    registerVisit() {
        this.pageVisitsCount++;
        this.triggerChanged('pageVisitsCount');
    }

    onDonationClicked(): boolean {
        if (this.donationClicked === true) return false;

        this.donationClicked = true;
        this.triggerChanged('donationClicked');
        return true;
    }

    setCookieDisclaimerHidden(value: boolean) {
        this.cookieDisclaimerHidden = value;
        this.triggerChanged('cookieDisclaimerHidden');
    }

    getPersistData(): PersistedAppData {
        return {
            emphasizeBytes: this.emphasizeBytes,
            uiTheme: this.uiTheme,
            version: this.version,
            debugMode: this.debugMode,
            pageVisitsCount: this.pageVisitsCount,
            donationClicked: this.donationClicked,
            annotateTypes: this.annotateTypes,
            dimExtraBits: this.dimExtraBits,
            cookieDisclaimerHidden: this.cookieDisclaimerHidden,
            centeredLayout: this.centeredLayout
        }
    }
};

function generateKey(): number {
    return Math.ceil(Math.random() * 10000000) ^ Date.now(); // Because why the hell not...
}

function normalizeTheme(theme: string): string {
    if (theme === 'iron') return 'graphite';
    return theme;
}
