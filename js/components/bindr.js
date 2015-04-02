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
        this.handlers = [];
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
        this.handlers.push(handler);
    };

    bindr.Model.prototype.notifyPropertyChanged = function(propertyName, value){
        this.handlers.forEach(function(h){
            h(propertyName, value);
        });
    };

    bindr.bindElement = function(model, element, propertyName) {
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