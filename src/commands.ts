import HelpResult from './models/HelpResult';
import AboutResult from './models/AboutResult';
import UnknownCommandResult from './models/UnknownCommandResult';
import ExpressionResult from './models/ExpressionResult';
import ErrorResult from './models/ErrorResult';
import WahtsnewResult from './models/WhatsnewResult';
import StringResult from './models/StringResult';
import * as expression from './expression/expression';
import uuid from 'uuid/v4';
import { CommandInput, CmdShell } from './core/cmd';
import { ExpressionInput } from './expression/expression-interfaces';
import AppState from './core/AppState';

export default {
    initialize (cmd: CmdShell, appState: AppState) {

        cmd.debugMode = appState.debugMode;
        appState.onChange(() => cmd.debugMode = appState.debugMode);

        cmd.command("help", (c: CommandInput) => appState.addCommandResult(new HelpResult(c.input)));
        cmd.command("clear", (c: CommandInput) => appState.clearCommandResults());
        cmd.command("em", (c: CommandInput) => appState.toggleEmphasizeBytes());
        cmd.command("dark", (c: CommandInput) => appState.setUiTheme('dark'));
        cmd.command("light", (c: CommandInput) => appState.setUiTheme('light'));
        cmd.command("midnight", (c: CommandInput) => appState.setUiTheme('midnight'));
        cmd.command("about", (c: CommandInput) => appState.addCommandResult(new AboutResult(c.input)));
        cmd.command("whatsnew", (c: CommandInput) => appState.addCommandResult(new WahtsnewResult(c.input)));
        cmd.command("guid", (c: CommandInput) => appState.addCommandResult(new StringResult(c.input, uuid())));
        cmd.command("-notrack", (c: CommandInput) => {});
        cmd.command("-debug", (c: CommandInput) => {
            appState.toggleDebugMode();
            appState.addCommandResult(new StringResult(c.input, `Debug Mode: ${appState.debugMode}`))
        });            

        cmd.command({
            canHandle: (input:string) => expression.parser.canParse(input),
            handle: function(c: CommandInput) {
                var expr = expression.parser.parse(c.input);
                appState.toggleDebugMode();
                appState.addCommandResult(new ExpressionResult(c.input, expr as ExpressionInput));
            }         
        })

        // Last command handler reports that input is unknown
        cmd.command({
            canHandle: () => true,
            handle: (c: CommandInput) => appState.addCommandResult(new UnknownCommandResult(c.input))
        });

        cmd.onError((input: string, err: Error) => appState.addCommandResult(new ErrorResult(input, err)));
    }
 }