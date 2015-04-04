app.run(function() {
    "use strict";

    var dispatcher = app.get('dispatcher');

    dispatcher.commands({
        'help': function() {
            var helpResult = document.querySelector('.result .help');
            if(helpResult != null) {
                moveHelpResultUp(helpResult);
                 return;
            }
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

    function moveHelpResultUp(helpResult) {
        var container = helpResult.parentNode.parentNode;
        if(container.parentNode.firstChild != container) {

            var out = container.parentNode;
            out.removeChild(container);
            out.insertBefore(container, out.firstChild);
        }

    }

});
