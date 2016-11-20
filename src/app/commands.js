import appState from './appState';
import * as result from './result/result';
var cmdConfig = {};

export default {
    initialize (cmd) {
            cmd.commands({
            'help': function() {
                var helpResult = document.querySelector('.result .helpResultTpl');
                if(helpResult != null) {
                    moveResultUp(helpResult);
                    return;
                }

                appState.addCommandResult(new result.HelpResult());                
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
    }
 }