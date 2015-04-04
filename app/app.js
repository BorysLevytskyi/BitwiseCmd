(function (should, Container, AppShell) {

    var di = new Container();
    var app = new AppShell(di);

    app.debugMode = false;

    app.bootstrap = function(rootViewElement) {
        this.rootViewElement = rootViewElement;
        this.initialize();
    };


    window.app = app;

})(window.should, window.Container, window.AppShell);