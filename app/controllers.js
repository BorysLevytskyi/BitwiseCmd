(function(app){

    app.controller('expressionInputCtrl', {
        $dispatcher:null,
        attachView: function (viewElement) {
            var d = this.$dispatcher;
            viewElement.addEventListener('keyup', function (args) {
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
       attachView: function(viewElement) {
           this.viewElement = viewElement;
       },
       detachView: function() {
           this.viewElement = null;
       },
       clear: function (){
           this.viewElement.innerHTML = '';
       },
       insert: function (htmlElement) {
           var vw = this.viewElement;
           if(vw.childNodes.length == 0) {
               vw.appendChild(htmlElement);
           }
           else
           {
               vw.insertBefore(htmlElement, vw.childNodes[0]);
           }
       }
    });

    app.controller('resultViewCtrl', app.service('resultView'));

})(window.app);
