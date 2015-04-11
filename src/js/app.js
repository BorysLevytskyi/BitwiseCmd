(function (core) {
    "use strict";

    var di = new core.Container();

    var app = new core.AppShell(di);

    app.set('cmdConfig', core.ObservableObject.create({
        emphasizeBytes: true,
        theme: 'dark'
    }));

    app.debugMode = false;

    app.bootstrap = function(rootViewElement) {
        console.group('Bootstrap');
        this.rootViewElement = rootViewElement;
        this.set('rootView', rootViewElement)
        this.initialize();
        console.groupEnd();
    };


    window.app = app;

})(window.core);