import HelpResult from './models/HelpResult';
import AboutResult from './models/AboutResult';
import UnknownCommandResult from './models/UnknownCommandResult';
import ExpressionResult from './models/ExpressionResult';
import ErrorResult from './models/ErrorResult';
import WahtsnewResult from './models/WhatsnewResult';
import StringResult from './models/StringResult';
import * as expression from './expression';
import uuid from 'uuid/v4';

var cmdConfig = {};

export default {
    initialize (cmd, appState) {

            cmd.commands({
                'help': function(c) {
                    appState.addCommandResult(new HelpResult(c.input));                
                },
                'clear': function() {
                    appState.clearCommandResults();
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
                'midnight': function() {
                    appState.setUiTheme('midnight');
                },
                'about': function(c) {
                    appState.addCommandResult(new AboutResult(c.input));
                },
                'whatsnew': function(c) {
                    appState.addCommandResult(new WahtsnewResult(c.input));
                },
                'guid': function(c) {
                    appState.addCommandResult(new StringResult(c.input, uuid()))
                },
                '-notrack': function () {}, 
                '-debug': function() {
                    console.log('Debug mode on')
                    cmd.debugMode = true;
                }
        });

        cmd.command({
            canHandle: (input) => expression.parser.canParse(input),
            handle: function(c) {
                var expr = expression.parser.parse(c.input);
                appState.addCommandResult(new ExpressionResult(c.input, expr));
            }         
        })

        // Last command handler reports that input is unknown
        cmd.command({
            canHandle: () => true,
            handle: (c) => appState.addCommandResult(new UnknownCommandResult(c.input))
        });

        cmd.onError((input, err) => appState.addCommandResult(new ErrorResult(input, err)));
    }
 }