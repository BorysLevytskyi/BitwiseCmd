(function (should, Container) {

    var app = {
        views: {},
        models: {},
        debugMode: false
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

})(window.should, window.Container);