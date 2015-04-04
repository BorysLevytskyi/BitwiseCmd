(function(core){
    var is = core.is;

    function ObservableObject () {
        this.executionHandlers = [];
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
        return obj;
    };

    ObservableObject.createGetter = function (propertyName){
        return function(){
            return this["_" + propertyName];
        }
    };

    ObservableObject.createSetter = function(propertyName){
        return function(value){
            this["_" + propertyName] = value;
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

        var handlers = this.executionHandlers;
        var index = handlers.push(func);
        return function () { handlers.splice(1, index); }
    };

    ObservableObject.prototype.notifyPropertyChanged = function(propertyName, value){
        this.executionHandlers.forEach(function(h){
            h(propertyName, value);
        });
    };

    core.ObservableObject = ObservableObject;
})(window.core);