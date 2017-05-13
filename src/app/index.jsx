import React from 'react';
import ReactDOM from 'react-dom';
import InputBox from './components/InputBox.jsx';
import AppState from './AppState';
import appStateStore from './appStateStore';
import cmd from './cmd';
import commands from './commands';
import AppRoot from './components/AppRoot';
import hash from './hash';
import log from 'loglevel';

setupLogger();

const appState = createAppState();

commands.initialize(cmd, appState);

executeStartupCommands();

var root = <AppRoot appState={appState} />;
ReactDOM.render(root, document.getElementById('root'));

log.debug("started");

function createAppState() {
    var stateData = appStateStore.getPersistedData();
    const appState = new AppState(stateData);
    appStateStore.watch(appState);
    log.debug("appState", appState);
    return appState;
}

function setupLogger() {
    if(window.location.host != 'bitwisecmd.com' ||  window.location.hash.indexOf('-debug') > -1) {
        log.setLevel("trace");
    } else {
        log.setLevel("warn");
    }
}

function executeStartupCommands() {
    var hashArgs = hash.getArgs(window.location.hash);

    var startupCommands = ['help', '1|2&6','1<<0x2a','2 4 8 16 32'];

    if(hashArgs.commands.length > 0) {
        startupCommands = hashArgs.commands;
    }

    startupCommands.forEach(cmd.execute.bind(cmd));
}