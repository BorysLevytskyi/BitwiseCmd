import React from 'react';
import AppState from '../shell/AppState';
import { CmdShell, CommandInput } from '../shell/cmd';
import ErrorResultView from '../shell/components/ErrorResultView';
import IpAddressView from './components/IpAddressView';
import { ipAddressParser, ParsingError, IpAddress, ParsedIpObject, IpAddressWithSubnetMask } from './ip';
import log from 'loglevel';

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
        });

        log.debug();
    }
}

export default networkingAppModule;