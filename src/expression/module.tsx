import React from 'react';
import AppState from '../shell/AppState';
import { CmdShell, CommandInput } from '../shell/cmd';
import BitwiseResultView from './components/BitwiseResultView';
import {parser} from './expression';

const expressionAppModule = {
    setup: function(appState: AppState, cmd: CmdShell) {
        
          // Bitwise Expressions
          cmd.command({
            canHandle: (input:string) => parser.canParse(input),
            handle: function(c: CommandInput) {
                var expr = parser.parse(c.input);
                appState.addCommandResult(c.input, () => <BitwiseResultView expression={expr!} emphasizeBytes={appState.emphasizeBytes} annotateTypes={appState.annotateTypes} dimExtrBits={appState.dimExtraBits} />);
            }
        });
    }
}

export default expressionAppModule;