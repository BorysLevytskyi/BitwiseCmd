(function(){
   var commandr = {

   };

    function Command(name) {
        this.name = name;
        this.executionHandlers = [];
    }

    Command.prototype.execute = function (cmdArgs) {
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

    commandr.Command = Command;

    window.commandr = commandr;
})();