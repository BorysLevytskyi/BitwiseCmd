import React from 'react';
import AppState from '../shell/AppState';
import { CmdShell, CommandInput, CommandOptions } from '../shell/cmd';
import ErrorResultView from '../shell/components/ErrorResultView';
import IpAddressView from './components/IpAddressView';
import ipAddressParser, {ParsingError, ParsedIpObject} from './ip-parser';
import { IpAddress, IpAddressWithSubnetMask, SubnetCommand } from "./models";
import log from 'loglevel';
import SubnetView from './components/SubnetView';
import { createSubnetMaskIp } from './subnet-utils';
import {sendAnalyticsEvent} from '../shell/analytics';

const networkingAppModule = {
    setup: function(appState: AppState, cmd: CmdShell) {
        
        // Add Ip Address commands
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

                if(result instanceof SubnetCommand) {
                    appState.addCommandResult(c.input, <SubnetView subnet={result} />);
                    trackCommand('SubnetCommand', c.options);
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
            
                appState.addCommandResult(c.input, <IpAddressView ipAddresses={ipAddresses} />);
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