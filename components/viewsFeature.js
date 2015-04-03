(function(app, is){
    app.modelView = function (modelCtor, builder) {
        var name = getKey(modelCtor);
        app.di.register(name, builder);
    };

    app.buildViewFor = function(model) {
        var key = getKey(model.constructor);
        var builder = this.di.resolve(key);
        return builder.renderView(model);
    };

    function getKey(modelCtor) {
        return getFunctionName(modelCtor) + "ViewBuilder";
    }

    function getFunctionName(func) {
        var str = func.toString();
        return str.substr(8, str.indexOf('(') - 8).trim();
    }

})(window.app, window.is);
