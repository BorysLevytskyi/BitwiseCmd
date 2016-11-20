import React from 'react';
import ReactDOM from 'react-dom';
import InputBox from './components/InputBox.jsx';
import appState from './appState';
import cmd from './cmd';
import commands from './commands';
import AppRoot from './components/AppRoot';

commands.initialize(cmd);

var root = <AppRoot appState={appState} />;
ReactDOM.render(root, document.getElementById('root'));