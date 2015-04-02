(function(app){
    var handlers = [];

    var dispatcher = {
        handler: function(handler) {
            handlers.push(handler);
        },
        dispatch: function(cmd) {
            var i, result;
            for(i=0; i<handlers.length; i++){
                result = handlers[i](cmd);

                if(result != null)
                {
                    this
                }

            }
        },

    };
})(window.app);
