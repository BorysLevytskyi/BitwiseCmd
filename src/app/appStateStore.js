const storeKey = 'AppState';

export default {
    getPersistedData() {
        var json = window.localStorage.getItem(storeKey);
        if(!json) {
            return {};
        }

        try {
            return JSON.parse(json);
        }
        catch(ex) {
            console.error('Failed to parse AppState json. Json Value: \n' + json, ex);
            return {};
        }
    },

    watch (appState) {
        appState.onChange(() => this.persistData(appState));
    },

    persistData(appState) {
        localStorage.setItem(storeKey, JSON.stringify(appState.getPersistData()));
    }
}