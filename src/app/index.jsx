import React from 'react';
import ReactDOM from 'react-dom';
import InputBox from './components/InputBox.jsx';
import AppState from './AppState';
import appStateStore from './appStateStore';
import cmd from './cmd';
import commands from './commands';
import AppRoot from './components/AppRoot';
import hash from './hash';


var stateData = appStateStore.getPersistedData();
const appState = new AppState(stateData);

appStateStore.watch(appState);

commands.initialize(cmd, appState);

console.log("appState", appState);

var hashArgs = hash.getArgs(window.location.hash);
var startupCommands = ['help', '1|2&6','1<<0x2a','2 4 8 16 32'];
if(hashArgs.length > 0) {
    startupCommands = hashArgs;
}

startupCommands.forEach(cmd.execute.bind(cmd));

var root = <AppRoot appState={appState} />;
ReactDOM.render(root, document.getElementById('root'));