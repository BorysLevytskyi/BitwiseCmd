(function(core){
    "use strict";
    var is = core.is;

    function ObservableObject () {
        this.$store = {};
        this.$executionHandlers = [];
    }

    ObservableObject.create = function(definition){
        var obj = new ObservableObject();

        for(var property in definition){
            if(!definition.hasOwnProperty(property)){
                continue;
            }

            Object.defineProperty(obj, property, {
                get:ObservableObject.createGetter(property),
                set:ObservableObject.createSetter(property)
            });

            obj[property] = definition[property];
        }

        return Object.seal(obj);
    };

    ObservableObject.createGetter = function (propertyName, store){
        return function(){
            return this.$store[propertyName];
        }
    };

    ObservableObject.createSetter = function(propertyName, store){
        return function(value){
            this.$store[propertyName] = value;
            this.notifyPropertyChanged(propertyName, value);
        }
    };

    ObservableObject.prototype.observe = function (property, handler){
        var func;
        if(is.aFunction(property)) {
            func = property;
        }
        else if(is.string(property) && is.aFunction(handler)) {
            func = function (p, v) {
                if(p === property) {
                    handler(p, v)
                }
            }
        }
        else {
            console.warn('Unsupported set of arguments: ', arguments);
            return;
        }

        var handlers = this.$executionHandlers;
        var index = handlers.push(func);
        return function () { handlers.splice(1, index); }
    };

    ObservableObject.prototype.notifyPropertyChanged = function(propertyName, value){
        this.$executionHandlers.forEach(function(h){
            h(propertyName, value);
        });
    };

    ObservableObject.prototype.store = function() {
        return this.$store;
    };

    ObservableObject.prototype.keys = function() {
        return Object.keys(this.$store);
    };

    core.ObservableObject = ObservableObject;

})(window.core);