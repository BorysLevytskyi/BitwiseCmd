(function(app){

    app.controller('expressionInputCtrl', {
        $dispatcher:null,
        onViewAttached: function () {
            var d = this.$dispatcher;
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
       clear: function (){
           this.viewElement.innerHTML = '';
       },
       display: function (htmlElement) {
           if(typeof htmlElement.tagName == "undefined") {
                htmlElement = app.buildViewFor(htmlElement);
           }

           var vw = this.viewElement;
           if(vw.childNodes.length == 0) {
               vw.appendChild(htmlElement);
           }
           else {
               vw.insertBefore(htmlElement, vw.childNodes[0]);
           }
       }
    });

    app.controller('resultViewCtrl', app.service('resultView'));

})(window.app);
