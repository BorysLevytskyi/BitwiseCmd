(function (should, commandr, bindr, Container) {

    var app = {
        views: {},
        models: {}
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


    // TODO: introduce command feature
    app.command = function(name, handler) {
        var cmd = commandHandlers[name];

        if(cmd == null) {
            cmd = commandHandlers[name] = new commandr.Command(name);
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

    app.run = function(observer) {
        runObservers.push(observer);
    };

    app.bootstrap = function(rootViewElement) {
        this.rootViewElement = rootViewElement;
        invokeRunObservers();
    };

    function invokeRunObservers() {
        runObservers.forEach(function(o){ o(); });
    }

    window.app = app;


})(window.should, window.commandr, window.bindr, window.Container);