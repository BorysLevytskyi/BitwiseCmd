import React from 'react';
import ReactDOM from 'react-dom';
import InputBox from './components/InputBox.jsx';
import AppState from './AppState';
import appStateStore from './appStateStore';
import cmd from './cmd';
import commands from './commands';
import AppRoot from './components/AppRoot';


var stateData = appStateStore.getPersistedData();
const appState = new AppState(stateData);

console.log('Loaded stateData', stateData);

appStateStore.watch(appState);

commands.initialize(cmd, appState);

console.log("appState", appState);

// cmd.execute('1');
// cmd.execute('2');
cmd.execute('1|2<<2');

var root = <AppRoot appState={appState} />;
ReactDOM.render(root, document.getElementById('root'));