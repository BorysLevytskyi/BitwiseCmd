(function (core) {

    var di = new core.Container();

    var app = new core.AppShell(di);

    app.set('cmdConfig', core.ObservableObject.create({
        emphasizeBytes: true
    }));

    app.debugMode = false;

    app.bootstrap = function(rootViewElement) {
        this.rootViewElement = rootViewElement;
        this.initialize();
    };


    window.app = app;

})(window.core);