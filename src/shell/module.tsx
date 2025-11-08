import React from 'react';
import {v4 as uuid} from 'uuid';
import { sendAnalyticsEvent } from './analytics';
import AppState from './AppState';
import { CmdShell, CommandInput } from './cmd';
import AboutResultView from './components/AboutResultView';
import DonateResultView from './components/DonateResultView';
import ErrorResultView from './components/ErrorResultView';
import HelpResultView from './components/HelpResultView';
import TextResultView from './components/TextResultView';
import WhatsnewResultView from './components/WhatsNewResultView';
import {STARTUP_COMMAND_KEY} from './startup';
import { INT32_MAX_VALUE, INT64_MAX_VALUE } from '../core/const';

const shellModule = {
    setup: function(appState: AppState, cmd: CmdShell) {
        
        cmd.debugMode = appState.debugMode;
        appState.onChange(() => cmd.debugMode = appState.debugMode);
        
        cmd.command("help", (c: CommandInput) => appState.addCommandResult(c.input, () => <HelpResultView />));
        cmd.command("clear", () => appState.clearCommandResults());
        cmd.command("em", () => appState.toggleEmphasizeBytes());
        cmd.command("dark", () => appState.setUiTheme('dark'));
        cmd.command("light", () => appState.setUiTheme('light'));
        cmd.command("midnight", () => appState.setUiTheme('midnight'));
        cmd.command("settings", () => appState.toggleShowSettings());
        cmd.command("bladerunner", () => {
            appState.setUiTheme('bladerunner');
            sendAnalyticsEvent({eventCategory: "UI", eventAction: "ThemeChanged", eventLabel: "bladerunner"});          
        });
        cmd.command("bladerunner-easter", (c: CommandInput) => { 
            cmd.execute("bladerunner")
            appState.addCommandResult(c.input, () => <TextResultView text="You've discovered the hidden Blade Runner theme. Next time, to activate this theme, use the command 'bladerunner'." />);            
        });
        cmd.command("about", (c: CommandInput) => appState.addCommandResult(c.input, () => <AboutResultView />));
        cmd.command("whatsnew", (c: CommandInput) => appState.addCommandResult(c.input, () => <WhatsnewResultView />));
        cmd.command("guid", (c: CommandInput) => appState.addCommandResult(c.input, () => <TextResultView text={uuid()} />));
        cmd.command("-notrack", () => {});
        cmd.command("-debug", (c: CommandInput) => {
            appState.toggleDebugMode();
            appState.addCommandResult(c.input, () => <TextResultView text={`Debug Mode: ${appState.debugMode}`}/>);
        }); 
        cmd.command('-annotate:on', (c:CommandInput) => appState.toggleAnnotateTypes(true))
        cmd.command('-annotate:off', (c:CommandInput) => appState.toggleAnnotateTypes(false))
        cmd.command('-em:off', (c:CommandInput) => appState.toggleEmphasizeBytes(false))
        cmd.command('-em:on', (c:CommandInput) => appState.toggleEmphasizeBytes(true))
        cmd.command("-max", (c:CommandInput) => {
            const text = `Int32 ${INT32_MAX_VALUE}\nInt64 ${INT64_MAX_VALUE}`
            appState.addCommandResult(c.input, () => <TextResultView text={text} />)
        })

        cmd.command("donate", (c:CommandInput) => {

            if(appState.onDonationClicked()) {
                sendAnalyticsEvent({eventCategory: "Donation", eventAction: "DonateButtonClicked"})
            }
            else {
                sendAnalyticsEvent({eventCategory: "Donation", eventAction: "DonateButtonClickedAgain"})
            }

            appState.addCommandResult(c.input, () => <DonateResultView />)
        });

        cmd.command("track", (c:CommandInput) => {
            sendAnalyticsEvent({
                eventCategory: 'General',
                eventAction: 'AnalyticsTest'
            });
        });

        if(appState.env !== 'prod') {
            
            // Default command for development purposes
            cmd.command({
                canHandle: (s: string) => s.indexOf('default') === 0,
                handle: (s: CommandInput) => {

                    const executeCommand = (c: string) => {

                        if(c.length === 0) {
                            return "Default comand: " + localStorage.getItem(STARTUP_COMMAND_KEY);
                        }
                        else if(c === 'clear') {
                            localStorage.removeItem(STARTUP_COMMAND_KEY);
                            return "Default startup command cleared";
                        }
                        
                        localStorage.setItem(STARTUP_COMMAND_KEY, c);
                        return `Default startup command saved: ${c}`;
                    };

                    const command = s.input.substring(7).trim();
                    const result = executeCommand(command);
                    appState.addCommandResult(s.input, () => <TextResultView text={result} />);
                } 
            });
        };

        cmd.onError((input: string, err: Error) => appState.addCommandResult(input, () => <ErrorResultView errorMessage={err.toString()} />));
    }
}

export default shellModule;


