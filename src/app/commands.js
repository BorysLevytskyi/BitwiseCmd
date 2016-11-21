import appState from './appState';
import HelpResult from './models/HelpResult';
import UnknownCommandResult from './models/UnknownCommandResult';

var cmdConfig = {};

export default {
    initialize (cmd) {
            cmd.commands({
            'help': function(c) {
                // var helpResult = document.querySelector('.result .helpResultTpl');
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
                cmdConfig.theme = 'dark';
            },
            'light': function () {
                cmdConfig.theme = 'light';
            },
            'about': function() {
                var aboutResult = document.querySelector('.result .aboutTpl');
                if(aboutResult != null) {
                    moveResultUp(aboutResult);
                    return;
                }
                return new app.models.ViewResult('aboutTpl');
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
        })
    }
 }