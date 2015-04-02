(function(){
    var bindr = {};

    bindr.model = function(definition){
        var model = new bindr.Model();
        for(var property in definition){
            if(!definition.hasOwnProperty(property)){
                continue;
            }

            Object.defineProperty(model, property, {
                get:bindr.Model.createGetter(property),
                set:bindr.Model.createSetter(property)
            });

            model[property] = definition[property];
        }
        return model;
    };

    bindr.Model = function() {
        this.executionHandlers = [];
    };

    bindr.Model.createGetter = function (propertyName){
        return function(){
            return this["_" + propertyName];
        }
    };

    bindr.Model.createSetter = function(propertyName){
        return function(value){
            this["_" + propertyName] = value;
            this.notifyPropertyChanged(propertyName, value);
        }
    };

    bindr.Model.prototype.observe = function (handler){
        this.executionHandlers.push(handler);
    };

    bindr.Model.prototype.notifyPropertyChanged = function(propertyName, value){
        this.executionHandlers.forEach(function(h){
            h(propertyName, value);
        });
    };

    bindr.bindElement = function(element, model, propertyName) {
        if(element.bindr != null) {
            return;
        }

        if(element.tagName == "INPUT") {
            bindInput(model, element, propertyName);
        }
        else {
            bindHtmlElement(model, element, propertyName);
        }

        element.bindr = {}; // will be used later
    };

    bindr.attachView = function(viewElement, model) {
        var elements = viewElement.querySelectorAll('[data-bindr]'),
            count = elements.length,
            i =0, el;

        for(;i<count; i++){
            el = elements[i];
            this.bindElement(el, model, el.getAttribute('data-bindr'))
        }

    };

    bindr.bindControllers = function (rootViewElement, controllers) {
        var elements = rootViewElement.querySelectorAll('[data-controller]'),
            i = 0, l = elements.length, name, ctrl, attached;

        for(;i<l;i++){
            var element = elements[i];
            name = element.getAttribute('data-controller');
            ctrl = controllers[name];
            attached = [];

            if(ctrl == null) {
                console.warn(nam + ' controller wasn\'t found');
                continue;
            }

            ctrl.attachView(element);
            attached.push(ctrl);

            console.log(name + ' Controller: view attached');

            if(typeof ctrl.detachView != "function") {
                continue;
            }

            element.addEventListener('DOMNodeRemoved', function () {
                ctrl.detachView();
                console.log(name + ' Controller: view detached');
            });
        }
    };

    function bindInput(model, intput, propertyName) {
        intput.addEventListener('keyup', function(e){
            model[propertyName] = e.srcElement.value;
        });

        model.observe(function(property, value){
            if(window.event && window.event.srcElement == intput) {
                return;
            }

            intput.value = value;
        });
    }

    function bindHtmlElement(model, el, propertyName) {
        model.observe(function(propery, value){
            if(propery == propertyName) {
                el.innerHTML = value;
            }
        });
    }

    window.bindr = bindr;
})();