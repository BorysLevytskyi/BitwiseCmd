import React from 'react';
import ReactDOM from 'react-dom/client';
import cmd, { CommandInput } from './shell/cmd';
import AppRoot from './shell/components/AppRoot';
import log from 'loglevel';
import './css/index.css';
import networkingAppModule from './networking/module';
import expressionAppModule from './expression/module';
import shellModule from './shell/module';
import bootstrapAppData from './shell/startup';
import UnknownInputResultView from './shell/components/UnknownInputResultView';


const appData = bootstrapAppData();

initializeModules();

executeStartupCommands();

appData.appState.registerVisit();

log.debug("started");

function executeStartupCommands() {
    log.debug("Executing startup commands", appData.startupCommands);
    appData.startupCommands.forEach(c => cmd.execute(c, {doNotTrack: true}));
}

function  initializeModules() {
    shellModule.setup(appData.appState, cmd);
    networkingAppModule.setup(appData.appState, cmd);
    expressionAppModule.setup(appData.appState, cmd);

    // Last command handler reports that input is unknown
    cmd.command({
        canHandle: () => true,
        handle: (c: CommandInput) => appData.appState.addCommandResult(c.input, () => <UnknownInputResultView input={c.input}/>)
    });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <AppRoot appState={appData.appState} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//eportWebVitals();
