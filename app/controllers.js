(function(app){

    app.controller('expressionInputCtrl', {
        attachView: function (viewElement) {
            var dispatcher = app.service('dispatcher');
            viewElement.addEventListener('keyup', function (args) {
                if (args.keyCode != 13) {
                    return;
                }

                // Enter
                dispatcher.dispatch(args.srcElement.value);
                args.srcElement.value = '';
            });
        }
    });

    app.service('resultView', {
       attachView: function(viewElement) {
           this.viewElement = viewElement;
       },
       detachView: function() {
           this.viewElement == null;
       },
       clear: function (){
           this.viewElement.innerHTML = '';
       },
       insert: function (htmlElement) {
           if(this.viewElement.childNodes.length == 0) {
               this.viewElement.appendChild(htmlElement);
           }
           else
           {
               this.viewElement.appendChild(htmlElement);
           }
       }
    });

    app.controller('resultViewCtrl', app.service('resultView'));

})(window.app);
