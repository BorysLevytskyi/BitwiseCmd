import HelpResult from './models/HelpResult';
import AboutResult from './models/AboutResult';
import UnknownCommandResult from './models/UnknownCommandResult';
import ExpressionResult from './models/ExpressionResult';
import * as expression from './expression';

var cmdConfig = {};

export default {
    initialize (cmd, appState) {

            cmd.command({
                   canHandle: (input) => expression.parser.canParse(input),
                   handle: function(c) {
                       var expr = expression.parser.parse(c.input);
                       appState.addCommandResult(new ExpressionResult(c.input, expr));
                   }         
             })

            cmd.commands({
                'help': function(c) {
                    // TODO: var helpResult = document.querySelector('.result .helpResultTpl');
                    // if(helpResult != null) {
                    //     moveResultUp(helpResult);
                    //     return;
                    // }

                    appState.addCommandResult(new HelpResult(c.input));                
                },
                'clear': function() {
                    appState.clearCommmandResults();
                },
                'em': function() {
                    cmdConfig.emphasizeBytes = !cmdConfig.emphasizeBytes;
                },
                'dark': function() {
                    appState.setUiTheme('dark');
                },
                'light': function () {
                    appState.setUiTheme('light');
                },
                'about': function(c) {
                    // 
                    // TODO: var aboutResult = document.querySelector('.result .aboutTpl');
                    // if(aboutResult != null) {
                    //     moveResultUp(aboutResult);
                    //     return;
                    // }
                    appState.addCommandResult(new AboutResult(c.input));
                },
                '-debug': function() {
                    app.debugMode = true;
                    console.log('debug is on');
                },
                '-notrack': function () {}
        });

        cmd.command({
            canHandle: () => true,
            handle: (c) => appState.addCommandResult(new UnknownCommandResult(c.input))
        });
    }
 }