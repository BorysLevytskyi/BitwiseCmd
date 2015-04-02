(function(){
    function subscribeEvents(element) {
        element.addEventListener('keyup', function(args) {

            if(args.keyCode == 13) {
            // Enter
                app.command('calculateExpression').fire();
            }

            console.log(args)
        });
    }

    app.controller('expressionInputCtrl', {
        bind: function (element) {
            subscribeEvents(element);
        }
    });



})(window.app);
