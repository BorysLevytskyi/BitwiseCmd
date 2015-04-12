exports.config = {
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

    specs: [
        './e2e/spec.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    chromeOptions: {
        binary: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        args: [],
        extensions: []
    }
};
