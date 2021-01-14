import React from 'react';
import uuid from 'uuid';
import AppState from './AppState';
import { CmdShell, CommandInput } from './cmd';
import AboutResultView from './components/AboutResultView';
import ErrorResultView from './components/ErrorResultView';
import HelpResultView from './components/HelpResultView';
import TextResultView from './components/TextResultView';
import WhatsnewResultView from './components/WhatsNewResultView';

const shellModule = {
    setup: function(appState: AppState, cmd: CmdShell) {
        
        cmd.debugMode = appState.debugMode;
        appState.onChange(() => cmd.debugMode = appState.debugMode);
        
        cmd.command("help", (c: CommandInput) => appState.addCommandResult(c.input, <HelpResultView />));
        cmd.command("clear", () => appState.clearCommandResults());
        cmd.command("em", () => appState.toggleEmphasizeBytes());
        cmd.command("dark", () => appState.setUiTheme('dark'));
        cmd.command("light", () => appState.setUiTheme('light'));
        cmd.command("midnight", () => appState.setUiTheme('midnight'));
        cmd.command("about", (c: CommandInput) => appState.addCommandResult(c.input, <AboutResultView />));
        cmd.command("whatsnew", (c: CommandInput) => appState.addCommandResult(c.input, <WhatsnewResultView />));
        cmd.command("guid", (c: CommandInput) => appState.addCommandResult(c.input, <TextResultView text={uuid()} />));
        cmd.command("-notrack", () => {});
        cmd.command("-debug", (c: CommandInput) => {
            appState.toggleDebugMode();
            appState.addCommandResult(c.input, <TextResultView text={`Debug Mode: ${appState.debugMode}`}/>);
        }); 

        cmd.onError((input: string, err: Error) => appState.addCommandResult(input, <ErrorResultView errorMessage={err.toString()} />));
    }
}

export default shellModule;