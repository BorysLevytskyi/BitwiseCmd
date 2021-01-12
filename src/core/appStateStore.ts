import AppState, { PersistedAppData } from "./AppState";

const storeKey = 'AppState';

export default {
    getPersistedData() : PersistedAppData {
        var json = window.localStorage.getItem(storeKey);
        if(!json) {
            return {} as PersistedAppData;
        }

        try {
            return JSON.parse(json) as PersistedAppData;
        }
        catch(ex) {
            console.error('Failed to parse AppState json. Json Value: \n' + json, ex);
            return {} as PersistedAppData;;
        }
    },

    watch (appState: AppState) {
        appState.onChange(() => this.persistData(appState));
    },

    persistData(appState: AppState) {
        localStorage.setItem(storeKey, JSON.stringify(appState.getPersistData()));
    }
}