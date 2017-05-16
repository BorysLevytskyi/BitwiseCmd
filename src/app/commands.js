import HelpResult from './models/HelpResult';
import AboutResult from './models/AboutResult';
import UnknownCommandResult from './models/UnknownCommandResult';
import ExpressionResult from './models/ExpressionResult';
import ErrorResult from './models/ErrorResult';
import WahtsnewResult from './models/WhatsnewResult';
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
                    appState.addCommandResult(new HelpResult(c.input));                
                },
                'clear': function() {
                    appState.clearCommmandResults();
                },
                'em': function() {
                    appState.toggleEmphasizeBytes();
                },
                'dark': function() {
                    appState.setUiTheme('dark');
                },
                'light': function () {
                    appState.setUiTheme('light');
                },
                'about': function(c) {
                    appState.addCommandResult(new AboutResult(c.input));
                },
                'whatsnew': function(c) {
                    appState.addCommandResult(new WahtsnewResult(c.input));
                },
                '-notrack': function () {}
        });

        // Last command handler reports that input is unknown
        cmd.command({
            canHandle: () => true,
            handle: (c) => appState.addCommandResult(new UnknownCommandResult(c.input))
        });

        cmd.onError((input, err) => appState.addCommandResult(new ErrorResult(input, err)));
    }
 }