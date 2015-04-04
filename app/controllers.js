app.compose(function() {

    app.controller('expressionInputCtrl', function (){
        var dispatcher = app.get('dispatcher');

        return {
            onViewAttached: function () {
                var d = dispatcher;

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
        }
    });

    app.controller('resultViewCtrl', function() {
        var html = app.get('html');

        return {
            clear: function () {
                this.viewElement.innerHTML = '';
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
    });

    app.controller('configPanelCtrl', {
        onViewAttached: function (){
            var self = this;
            self.update();
            app.cmdConfig.observe(function(){
                self.update();
            });
        },
        update: function () {
            var emIndicator = this.viewElement.querySelector('#emphasizeBytes');
            emIndicator.style.display = app.cmdConfig.emphasizeBytes ? '' : 'none';
        }
    });

});


