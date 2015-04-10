app.run(function() {
    "use strict";

    var cmd = app.get('cmd');
    var cmdConfig = app.get('cmdConfig');
    var rootView = app.get('rootView');

    cmd.commands({
        'help': function() {
            var helpResult = document.querySelector('.result .helpResultTpl');
            if(helpResult != null) {
                moveResultUp(helpResult);
                return;
            }
            return new app.models.ViewResult('helpResultTpl');
        },
        'clear': function() {
            cmd.clear();
        },
        'em': function() {
            cmdConfig.emphasizeBytes = !cmdConfig.emphasizeBytes;
        },
        'dark': function() {
            cmdConfig.theme = 'dark';
        },
        light: function () {
            cmdConfig.theme = 'light';
        },
        about: function() {
            var aboutResult = document.querySelector('.result .aboutTpl');
            if(aboutResult != null) {
                moveResultUp(aboutResult);
                return;
            }
            return new app.models.ViewResult('aboutTpl');
        }
    });

    // TODO: Make as function
    cmd.command({
        canHandle: function(input) { return app.get('expression').canParse(input); },
        handle: function(input) {
            return app.get('expression').parse(input);
        }
    });

    function moveResultUp(helpResult) {
        var container = helpResult.parentNode.parentNode;
        if(container.parentNode.firstChild != container) {

            var out = container.parentNode;
            out.removeChild(container);
            out.insertBefore(container, out.firstChild);
        }

    }

});
