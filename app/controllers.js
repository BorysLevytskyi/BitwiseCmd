(function(app){

    app.controller('expressionInputCtrl', {
        $dispatcher:null,
        onViewAttached: function () {
            var d = this.$dispatcher;
            this.viewElement.focus();
            this.viewElement.addEventListener('keyup', function (args) {
                if (args.keyCode != 13) {
                    return;
                }

                // Enter
                d.dispatch(args.srcElement.value);
                args.srcElement.value = '';
            });
        }
    });

    app.service('resultView', {
       $html: null,
       clear: function (){
           this.viewElement.innerHTML = '';
       },
       onViewAttached: function(el) {
           var r = 1;
       },
       display: function (input, model) {
           var result = new app.models.DisplayResult(input, model);
           var view = app.buildViewFor(result);

           var vw = this.viewElement;
           if(vw.childNodes.length == 0) {
               vw.appendChild(view);
           }
           else {
               vw.insertBefore(view, vw.childNodes[0]);
           }
       }
    });

    app.controller('resultViewCtrl', app.service('resultView'));

})(window.app);
