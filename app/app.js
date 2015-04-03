(function (should, commandr, bindr, Container) {

    var app = {
        views: {}
    };

    var commandHandlers = {};
    var runObservers = [];

    app.di = new Container();

    app.component = function(name, inst) {
        if(arguments.length == 1) {
            return this.di.resolve(name);
        }

        this.di.register(name, inst);
    };

    app.get = function(name) {
        return this.di.resolve(name);
    };

    app.service = app.component;

    app.controller = function(name, inst) {
        this.addControllerMixin(inst);
        this.di.register(name, inst);
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
        bindr.bindControllers(rootViewElement, app.di);
    };

    function invokeRunObservers() {
        runObservers.forEach(function(o){ o(); });
    }

    window.app = app;

    app.addControllerMixin = function (component) {
        component.attachView = function(viewElement) {

            this.viewElement = viewElement;

            if(typeof component.onViewAttached == 'function') {
                component.onViewAttached(viewElement);
            }
        };

        component.detachView = function() {

            this.viewElement = null;

            if(typeof component.onViewDetached == 'function') {
                component.onViewDetached(viewElement);
            }
        };
    }


})(window.should, window.commandr, window.bindr, window.Container);