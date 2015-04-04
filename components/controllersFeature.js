(function(app, should, Container) {

    var controllerDi = app.di; // TODO: Compbine

    app.controller = function(name, instOrFactory) {

        should.beString(name, "name");

        if(instOrFactory == null) {
            return controllerDi.resolve(name);
        }

        var reg = new Container.Registration(instOrFactory);

        reg.onFirstTimeResolve = function (inst) {
            addControllerMixin(inst);
        };

        controllerDi.register(name, reg);
    };

    function addControllerMixin(ctrl) {
        ctrl.attachView = function(viewElement) {

            this.viewElement = viewElement;

            if(typeof ctrl.onViewAttached == 'function') {
                ctrl.onViewAttached(viewElement);
            }
        };

        ctrl.detachView = function() {

            this.viewElement = null;

            if(typeof ctrl.onViewDetached == 'function') {
                ctrl.onViewDetached(viewElement);
            }
        };
    }

    app.run(function(){
        attachControllers(app.rootViewElement, app.di);
    });

    function attachControllers(rootViewElement) {
        var elements = rootViewElement.querySelectorAll('[data-controller]'),
            i = 0, l = elements.length,
            ctrlName,
            ctrl, element;

        for(;i<l;i++){
            element = elements[i];
            ctrlName = element.getAttribute('data-controller');
            ctrl = app.controller(ctrlName);

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

    function isController(obj) {
        return obj.componentType == 'controller';

    }

})(window.app, window.should, window.Container);
