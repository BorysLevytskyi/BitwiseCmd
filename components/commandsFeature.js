(function(app, core){

    var should = core.should;

    function Command(name) {
        this.name = name;
        this.executionHandlers = [];
    }

    Command.prototype.execute = function (cmdArgs) {
        cmdArgs = cmdArgs || {};
        cmdArgs.commandHandled = false;

        for(var i=0; i<this.executionHandlers.length; i++) {
            this.executionHandlers[i](cmdArgs);
            if(cmdArgs.commandHandled === true) {
                return;
            }
        }
    };

    Command.prototype.subscribe = function (handler) {
        this.executionHandlers.push(handler);
        // TODO: unsubcribe
    };

    app.commandHandlers = {};

    app.command = function(name, handler) {
        var cmd = this.commandHandlers[name];

        if(cmd == null) {
            cmd = this.commandHandlers[name] = new commandr.Command(name);
        }

        if(typeof handler == "function") {
            cmd.subscribe(handler);
        }

        if (typeof handler == "object") {

            if(typeof handler.execute != "function"){
                console.warn('Given handler is an object, but doesn\'t have "execute" function');
                return cmd;
            }

            this.di.resolveProperties(handler);
            cmd.subscribe(handler.execute.bind(handler));
        }

        return cmd;
    };

    window.commandr = commandr;

})(window.app, window.core);