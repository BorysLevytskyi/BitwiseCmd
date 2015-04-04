app.run(function() {

    var dispatcher = app.get('dispatcher');

    dispatcher.commands({
        'help': function() {
            return new app.models.HelpResult();
        },
        'clear': function() {
            app.controller('resultViewCtrl').clear();
        },
        'em': function() {
            var cfg = app.get('cmdConfig');
            cfg.emphasizeBytes = !cfg.cmdConfig.emphasizeBytes;
        }
    });

    // TODO: Make as function
    dispatcher.command({
        canHandle: function(input) { return app.get('expression').canParse(input); },
        handle: function(input) {
            return app.get('expression').parse(input);
        }
    });
});
