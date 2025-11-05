import React from 'react';
import AppState from '../shell/AppState';
import { CmdShell, CommandInput, CommandOptions } from '../shell/cmd';
import ErrorResultView from '../shell/components/ErrorResultView';
import IpAddressView from './components/IpAddressView';
import ipAddressParser, {ParsingError, ParsedIpObject} from './ip-parser';
import { IpAddress, IpAddressWithSubnetMask, SubnetCommand, VpcCommand } from "./models";
import log from 'loglevel';
import SubnetView from './components/SubnetView';
import { createSubnetMaskIp } from './subnet-utils';
import {sendAnalyticsEvent} from '../shell/analytics';
import VpcView from './components/VpcView';

const networkingAppModule = {
    setup: function(appState: AppState, cmd: CmdShell) {
        
        // Add Ip Address commands
        cmd.command({
            canHandle: (input:string) => {
                const parsed = ipAddressParser.parse(input);
                return parsed !== null && parsed !== undefined;
            },
            handle: function(c: CommandInput) {
                var result = ipAddressParser.parse(c.input);

                if(result === null || result === undefined)
                    return;

                if(result instanceof ParsingError) {
                    appState.addCommandResult(c.input, () => <ErrorResultView errorMessage={(result as ParsingError).errorMessage} />);
                    return;
                }

                if(result instanceof SubnetCommand) {
                    appState.addCommandResult(c.input, () => <SubnetView subnet={result as SubnetCommand} />);
                    trackCommand('SubnetCommand', c.options);
                    return;
                }

                if(result instanceof VpcCommand) {
                    appState.addCommandResult(c.input, () => <VpcView vpc={result as VpcCommand} />);
                    trackCommand('VpcCommand', c.options);
                    return;
                }

                const ipAddresses : IpAddress[] = [];
                
                (result as ParsedIpObject[]).forEach(r => {
                    if(r instanceof IpAddressWithSubnetMask)
                    {
                        ipAddresses.push(r.ipAddress);
                        ipAddresses.push(createSubnetMaskIp(r));
                    }
                    else if(r instanceof IpAddress) {
                        ipAddresses.push(r);
                    }                    
                });

                trackCommand("IpAddressesInput", c.options);
            
                appState.addCommandResult(c.input, () => <IpAddressView ipAddresses={ipAddresses} />);
            }
        });

        log.debug();
    }
}

function trackCommand(action: string, ops: CommandOptions) {
    if(ops.doNotTrack !== true) {
        sendAnalyticsEvent({
            eventCategory: "NetworkingCommand",
            eventAction: action
        });
    }
}

export default networkingAppModule;