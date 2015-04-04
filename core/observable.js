(function(){
    var observable = {};

    observable.create = function(definition){
        var obj = new bindr.ObservableObject();
        for(var property in definition){
            if(!definition.hasOwnProperty(property)){
                continue;
            }

            Object.defineProperty(obj, property, {
                get:bindr.ObservableObject.createGetter(property),
                set:bindr.ObservableObject.createSetter(property)
            });

            obj[property] = definition[property];
        }
        return obj;
    };

    observable.ObservableObject = function() {
        this.executionHandlers = [];
    };

    observable.ObservableObject.createGetter = function (propertyName){
        return function(){
            return this["_" + propertyName];
        }
    };

    observable.ObservableObject.createSetter = function(propertyName){
        return function(value){
            this["_" + propertyName] = value;
            this.notifyPropertyChanged(propertyName, value);
        }
    };

    observable.ObservableObject.prototype.observe = function (handler){
        var handlers = this.executionHandlers;
        var index = handlers.push(handler);
        return function () { handlers.splice(1, index); }
    };

    observable.ObservableObject.prototype.notifyPropertyChanged = function(propertyName, value){
        this.executionHandlers.forEach(function(h){
            h(propertyName, value);
        });
    };

    window.core.observable = observable;
});