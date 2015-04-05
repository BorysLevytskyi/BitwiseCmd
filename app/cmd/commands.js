app.run(function() {
    "use strict";

    var cmd = app.get('cmd');
    var cmdConfig = app.get('cmdConfig');

    cmd.commands({
        'help': function() {
            var helpResult = document.querySelector('.result .help');
            if(helpResult != null) {
                moveHelpResultUp(helpResult);
                 return;
            }
            return new app.models.HelpResult();
        },
        'clear': function() {
            cmd.clear();
        },
        'em': function() {
            cmdConfig.emphasizeBytes = !cmdConfig.emphasizeBytes;
        }
    });

    // TODO: Make as function
    cmd.command({
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
