import cmd, { CommandInput } from './shell/cmd';
import AppRoot from './shell/components/AppRoot';
import log from 'loglevel';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import networkingAppModule from './networking/module';
import expressionAppModule from './expression/module';
import shellModule from './shell/module';
import bootstrapAppData from './shell/startup';
import UnknownInputResultView from './shell/components/UnknownInputResultView';

const appData = bootstrapAppData();

initializeModules();

var root = <AppRoot appState={appData.appState} />;
ReactDOM.render(root, document.getElementById('root'));

executeStartupCommands();

log.debug("started");

function executeStartupCommands() {
    log.debug("Executing startup commands", appData.startupCommands);
    appData.startupCommands.forEach(cmd.execute.bind(cmd));
}

function  initializeModules() {
    shellModule.setup(appData.appState, cmd);
    networkingAppModule.setup(appData.appState, cmd);
    expressionAppModule.setup(appData.appState, cmd);

    // Last command handler reports that input is unknown
    cmd.command({
        canHandle: () => true,
        handle: (c: CommandInput) => appData.appState.addCommandResult(c.input, <UnknownInputResultView input={c.input}/>)
    });
}



