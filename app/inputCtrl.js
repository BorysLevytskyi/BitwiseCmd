(function(){
    function subscribeEvents(element) {
        element.addEventListener('keyup', function(args) {

            if(args.keyCode == 13) {
            // Enter
                app.command('dispatchInput').execute({ input: args.srcElement.value });
                args.srcElement.value = '';
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
