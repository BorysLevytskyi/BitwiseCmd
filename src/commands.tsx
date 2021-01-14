import * as expression from './expression/expression';
import React from 'react';
import uuid from 'uuid/v4';
import { CommandInput, CmdShell } from './core/cmd';
import AppState from './core/AppState';
import {ParsingError, IpAddress, ipAddressParser, IpAddressWithSubnetMask, ParsedIpObject} from './ipaddress/ip'
import ErrorResultView from './components/results/ErrorResultView';
import HelpResultView from './components/results/HelpResultView';
import AboutResultView from './components/results/AboutResultView';
import WhatsnewResultView from './components/results/WhatsNewResultView';
import TextResultView from './components/results/TextResultView';
import IpAddressView from './components/results/IpAddressView';
import UnknownInputResultView from './components/results/UnknownInputResultView';
import BitwiseOperationExpressionView from './components/results/expressions/BitwiseOperationExpressionView';

export default {
    initialize (cmd: CmdShell, appState: AppState) {

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


        // Ip Addresses
        cmd.command({
            canHandle: (input:string) => ipAddressParser.parse(input) != null,
            handle: function(c: CommandInput) {
                var result = ipAddressParser.parse(c.input);

                if(result == null)
                    return;

                if(result instanceof ParsingError) {
                    appState.addCommandResult(c.input, <ErrorResultView errorMessage={result.errorMessage} />);
                    return;
                }

                const ipAddresses : IpAddress[] = [];
                
                (result as ParsedIpObject[]).forEach(r => {
                    if(r instanceof IpAddressWithSubnetMask)
                    {
                        ipAddresses.push(r.ipAddress);
                        ipAddresses.push(r.createSubnetMaskIp());
                    }
                    else if(r instanceof IpAddress) {
                        ipAddresses.push(r);
                    }
                });
            
                appState.addCommandResult(c.input, <IpAddressView ipAddresses={ipAddresses} />);
            }         
        })

        // Bitwise Expressions
        cmd.command({
            canHandle: (input:string) => expression.parser.canParse(input),
            handle: function(c: CommandInput) {
                var expr = expression.parser.parse(c.input);
                appState.addCommandResult(c.input, <BitwiseOperationExpressionView expression={expr!} emphasizeBytes={appState.emphasizeBytes} />);
            }         
        })

        // Last command handler reports that input is unknown
        cmd.command({
            canHandle: () => true,
            handle: (c: CommandInput) => appState.addCommandResult(c.input, <UnknownInputResultView input={c.input}/>)
        });

        cmd.onError((input: string, err: Error) => appState.addCommandResult(input, <ErrorResultView errorMessage={err.toString()} />));
    }
 }