app.set('cmd', function() {
    "use strict";

    var handlers = [];
    var is = app.get('is');
    var cmdController = app.controller('cmdController');

    return {
        execute: function(rawInput) {
            var input = rawInput.trim().toLowerCase();
            var handler = findHandler(input);

            if(handler != null) {
                if(app.debugMode) {
                    invokeHandler(input, handler);
                } else {
                    try {
                        invokeHandler(input, handler);
                    } catch (e) {
                        displayCommandError(input, "Error: " + e);
                    }
                }
            }
            else {
                displayCommandError(input, "Unsupported expression: " + input.trim());
            }
        },
        commands: function(catalog) {
            for(var key in catalog) {
                if(catalog.hasOwnProperty(key)) {
                    this.command(key, catalog[key]);
                }
            }
        },
        command: function(cmd, handler) {
            var h = createHandler(cmd, handler);
            if(h == null){
                console.warn('unexpected set of arguments: ', Array.prototype.splice.call(arguments));
                return;
            }

            if(!is.aFunction(h.canHandle)) {
                console.warn('handler is missing "canHandle" function. registration denied.');
                return;
            }

            if(!is.aFunction(h.handle)) {
                console.warn('handler is missing "handle" function. registration denied.');
                return;
            }

            handlers.push(h);
        },
        clear: function() {
            cmdController.clear();
        }
    };

    function displayCommandError(input, message) {
        var error = new app.models.ErrorResult(message);
        cmdController.display(new app.models.DisplayResult(input, error));
    }

    function invokeHandler (input, handler) {
        var cmdResult = handler.handle(input);
        if(cmdResult != null) {
            var r = new app.models.DisplayResult(input, cmdResult);
            cmdController.display(r);
        }
    }

    function createHandler (cmd, handler) {
        if(is.plainObject(cmd)) {
            return cmd;
        }

        if(is.string(cmd)) {
            return { canHandle: function (input) { return input === cmd; }, handle: handler };
        }

        return null;
    }

    function findHandler (input) {
        var i= 0;
        for(i;i<handlers.length; i++) {
            if(handlers[i].canHandle(input)) {
                return handlers[i];
            }
        }
    }
});