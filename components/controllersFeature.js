(function(app) {

    app.controller = function(name, inst) {
        addControllerMixin(inst);
        this.di.register(name, inst);
    };

    function addControllerMixin(component) {
        component.attachView = function(viewElement) {

            this.viewElement = viewElement;

            if(typeof component.onViewAttached == 'function') {
                component.onViewAttached(viewElement);
            }
        };

        component.detachView = function() {

            this.viewElement = null;

            if(typeof component.onViewDetached == 'function') {
                component.onViewDetached(viewElement);
            }
        };
    }

    app.run(function(){
        attachControllers(app.rootViewElement, app.di);
    });

    function attachControllers(rootViewElement, di) {
        var elements = rootViewElement.querySelectorAll('[data-controller]'),
            i = 0, l = elements.length,
            ctrlName,
            ctrl, element;

        for(;i<l;i++){
            element = elements[i];
            ctrlName = element.getAttribute('data-controller');
            ctrl = di.resolve(ctrlName);

            if(ctrl == null) {
                console.warn(ctrlName + ' controller wasn\'t found');
                continue;
            }

            ctrl.attachView(element);

            console.log(ctrlName + ' Controller: view attached');

            if(typeof ctrl.detachView != "function") {
                continue;
            }

            // TODO: get rid from closure
            element.addEventListener('DOMNodeRemoved', function (evt) {
                if(element === evt.target) {
                    ctrl.detachView();
                }

                console.log(ctrlName + ' Controller: view detached');
            });
        }
    }

})(window.app);
