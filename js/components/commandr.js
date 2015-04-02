(function(){
   var commandr = {

   };

    function Command(name) {
        this.name = name;
        this.handlers = [];
    }

    Command.prototype.fire = function (arg) {
        for(var i=0; i<1; i++) {
            this.handlers[i](arg);
        }
    };

    Command.prototype.subscribe = function (handler) {
        this.handlers.push(handler);
        // TODO: unsubcribe
    };

    commandr.Command = Command;

    window.commandr = commandr;
})();