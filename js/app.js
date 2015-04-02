(function (should, bindr) {

    var app = {};

    app.views = {};
    var servicesContainer = {};
    var controllersContainer = {};
    var events = {};

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

    app.command = function(name) {
        var evt = events[name];
        if(evt == null) {
            evt = events[name] = new Command(name);
        }
        return evt;
    };

    window.app = app;

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
    }

})(window.should);