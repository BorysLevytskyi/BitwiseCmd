import AppState from './core/AppState';
import appStateStore from './core/appStateStore';
import cmd from './core/cmd';
import commands from './commands';
import AppRoot from './AppRoot';
import hash from './core/hash';
import log from 'loglevel';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const env = window.location.host === "bitwisecmd.com" ? 'prod' : 'stage';
setupLogger(env);

const appState = createAppState(env);

commands.initialize(cmd, appState);

executeStartupCommands();

var root = <AppRoot appState={appState} />;
ReactDOM.render(root, document.getElementById('root'));

log.debug("started");

function createAppState(env:string) {
    var stateData = appStateStore.getPersistedData();
    const appState = new AppState(stateData, env);
    appStateStore.watch(appState);
    log.debug("appState initialized", appState);
    return appState;
}

function setupLogger(env: string) {
    if(env != 'prod'){
        log.setLevel("debug");
    } else {
        log.setLevel("warn");
    }
}

function executeStartupCommands() {
    var hashArgs = hash.getArgs(window.location.hash);

    var startupCommands = ['help', '1|2&6','1 2 4 8 16 32 0b1000000 0x80'];

    if(appState.wasOldVersion) {
        startupCommands = ["whatsnew"];
    }

    if(hashArgs.length > 0) {
        startupCommands = hashArgs;
    }

    startupCommands.forEach(cmd.execute.bind(cmd));
}

