(function() {
    "use strict";
    
    function AppShell(diContainer) {
        this.models = {};
        this.di = diContainer;
        this.runList = [];
        this.compositionList = [];
    }

    AppShell.prototype.get = function(name) {
        return this.di.resolve(name);
    };

    AppShell.prototype.set = function(name, def) {
        this.di.register(name, def);
    };

    AppShell.prototype.run = function(func) {
        this.runList.push(func);
    };

    AppShell.prototype.compose = function (func) {
        this.compositionList.push(func);
    };

    AppShell.prototype.initialize = function () {
        callInvocationList(this.compositionList);
        callInvocationList(this.runList);
    };

    function callInvocationList(functions) {
        functions.forEach(function(o){ o(); });
    }

    window.core.AppShell = AppShell;
})();