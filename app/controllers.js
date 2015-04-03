(function(app, is){

    app.controller('expressionInputCtrl', {
        $dispatcher:null,
        onViewAttached: function () {
            var d = this.$dispatcher;

            var self = this;
            self.history =[];
            self.historyIndex = 0;

            this.viewElement.focus();

            this.viewElement.addEventListener('keyup', function (args) {
                var inpt = args.srcElement;

                if (args.keyCode != 13) {
                    return;
                }

                // Enter
                d.dispatch(inpt.value);
                self.history.unshift(inpt.value);
                self.historyIndex = 0;
                inpt.value = '';
            });

            this.viewElement.addEventListener('keydown', function(args){
                console.log(args.keyCode);
                if(args.keyCode == 38) {

                    if (self.history.length > self.historyIndex) { // up
                        args.srcElement.value = self.history[self.historyIndex++];

                    }

                    args.preventDefault();
                    return;
                }

                if(args.keyCode == 40) {

                    if(self.historyIndex > 0) { // up
                        args.srcElement.value = self.history[--self.historyIndex];
                    }

                    args.preventDefault();
                    return;
                }
            })
        }
    });

    var resultViewController = {
        $html: null,
        clear: function (){
            this.viewElement.innerHTML = '';
        },
        onViewAttached: function(el) {
            var r = 1;
        },
        display: function ( model) {
            var view = app.buildViewFor(model);

            var vw = this.viewElement;
            if(vw.childNodes.length == 0) {
                vw.appendChild(view);
            }
            else {
                vw.insertBefore(view, vw.childNodes[0]);
            }
        }
    };

    app.component('resultView', resultViewController);
    app.controller('resultViewCtrl', resultViewController);

})(window.app, window.is);
