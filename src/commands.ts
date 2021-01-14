import HelpResult from './models/HelpResult';
import AboutResult from './models/AboutResult';
import UnknownCommandResult from './models/UnknownCommandResult';
import ExpressionResult from './models/ExpressionResult';
import {UnhandledErrorResult, ErrorResult} from './models/ErrorResults';
import WahtsnewResult from './models/WhatsnewResult';
import StringResult from './models/StringResult';
import * as expression from './expression/expression';
import uuid from 'uuid/v4';
import { CommandInput, CmdShell } from './core/cmd';
import { ExpressionInput } from './expression/expression-interfaces';
import AppState from './core/AppState';
import {ParsingError, IpAddress, ipAddressParser, IpAddressWithSubnetMask, ParsedIpObject} from './ipaddress/ip'
import IpAddressResult from './models/IpAddressResult';
import { isGetAccessor, isPrefixUnaryExpression } from 'typescript';

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


        // Ip Addresses
        cmd.command({
            canHandle: (input:string) => ipAddressParser.parse(input) != null,
            handle: function(c: CommandInput) {
                var result = ipAddressParser.parse(c.input);

                if(result == null)
                    return;

                if(result instanceof ParsingError) {
                    appState.addCommandResult(new ErrorResult(c.input, result.errorMessage));
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
            
                appState.addCommandResult(new IpAddressResult(c.input, ipAddresses));
            }         
        })

        // Bitwise Expressions
        cmd.command({
            canHandle: (input:string) => expression.parser.canParse(input),
            handle: function(c: CommandInput) {
                var expr = expression.parser.parse(c.input);
                appState.addCommandResult(new ExpressionResult(c.input, expr as ExpressionInput));
            }         
        })

        // Last command handler reports that input is unknown
        cmd.command({
            canHandle: () => true,
            handle: (c: CommandInput) => appState.addCommandResult(new UnknownCommandResult(c.input))
        });

        cmd.onError((input: string, err: Error) => appState.addCommandResult(new UnhandledErrorResult(input, err)));
    }
 }