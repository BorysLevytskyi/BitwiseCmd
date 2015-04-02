(function (should, commandr, bindr) {

    var app = {
        views: {}
    };

    var servicesContainer = {};
    var controllersContainer = {};
    var commandHandlers = {};
    var runObservers = [];

    function resolveOrInject(name, inst, container, entityName) {
        var resolved;

        should.beString(name);

        if (inst != null) {
            container[name] = inst;
            console.log(name + " " + entityName + "  registered");
            resolved = inst;
        }
        else {
            resolved = container[name];
            should.check(resolved != null, name + " " + entityName + " wasn't found");
        }

        return resolved;
    }

    app.service = function(name, inst) {
        return resolveOrInject(name, inst, servicesContainer, "service");
    };

    app.controller = function(name, inst) {
        return resolveOrInject(name, inst, controllersContainer, "controller");
    };

    app.command = function(name, handler) {
        var cmd = commandHandlers[name];

        if(cmd == null) {
            cmd = commandHandlers[name] = new commandr.Command(name);
        }

        if(typeof handler == "function") {
            cmd.subscribe(handler);
        }

        return cmd;
    };

    app.run = function(observer) {
        runObservers.push(observer);
    };

    app.bootstrap = function(rootViewElement) {
        invokeRunObservers();
        bindr.bindControllers(rootViewElement, controllersContainer);
    };

    function invokeRunObservers() {
        runObservers.forEach(function(o){ o(); });
    }

    window.app = app;



})(window.should, window.commandr, window.bindr);