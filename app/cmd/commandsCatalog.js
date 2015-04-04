app.run(function() {
    "use strict";

    var dispatcher = app.get('dispatcher');

    dispatcher.commands({
        'help': function() {
            return new app.models.HelpResult();
        },
        'clear': function() {
            app.controller('cmdController').clear();
        },
        'em': function() {
            var cfg = app.get('cmdConfig');
            cfg.emphasizeBytes = !cfg.emphasizeBytes;
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
