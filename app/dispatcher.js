(function(app){

    var dispatcher = {
        dispatch: function(input) {
            app.command('dispatchInput').execute({input:input});
        }
    };

    app.service('dispatcher', dispatcher);

})(window.app);
