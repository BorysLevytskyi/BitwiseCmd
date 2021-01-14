import React from 'react';
import AppState from '../shell/AppState';
import { CmdShell, CommandInput } from '../shell/cmd';
import BitwiseOperationExpressionView from './components/BitwiseOperationExpressionView';
import {parser} from './expression';

const expressionAppModule = {
    setup: function(appState: AppState, cmd: CmdShell) {
        
          // Bitwise Expressions
          cmd.command({
            canHandle: (input:string) => parser.canParse(input),
            handle: function(c: CommandInput) {
                var expr = parser.parse(c.input);
                appState.addCommandResult(c.input, <BitwiseOperationExpressionView expression={expr!} emphasizeBytes={appState.emphasizeBytes} />);
            }
        });
    }
}

export default expressionAppModule;