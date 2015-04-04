(function(core){
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

    ObservableObject.prototype.observe = function (handler){
        var handlers = this.executionHandlers;
        var index = handlers.push(handler);
        return function () { handlers.splice(1, index); }
    };

    ObservableObject.prototype.notifyPropertyChanged = function(propertyName, value){
        this.executionHandlers.forEach(function(h){
            h(propertyName, value);
        });
    };

    core.ObservableObject = ObservableObject;
})(window.core);