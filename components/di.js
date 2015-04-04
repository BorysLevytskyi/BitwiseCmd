// Problems: no check for the circular references

(function(is){
    function Container(store) {
        this.store = {};
        this.resolutionPath = [];
    }

    Container.prototype.register = function(name, def) {
        var reg = this.store[name];
        if(reg == null) {
            if(def instanceof Registration) {
                reg = def;
            }
            else {
                reg = new Registration(def);
            }

            reg.name = name;
            this.store[name] = reg;
        }

        console.log(name + ' component registered');
        return reg;
    };

    Container.prototype.resolve = function(name) {

        if(contains(this.resolutionPath, name)) {
            throw new Error("Failed to resolve service: " + name + ". Circular reference: " + this.resolutionPath.join(' < '));
        }

        this.resolutionPath.unshift(name);

        console.log('resolution path:' + this.resolutionPath.join(' < '));

        var reg = this.store[name];
        if(reg == null) {
            throw new Error(name + ' component is not registered');
        }

        if(reg.resolved == null) {
            reg.createInstance();
        }

        this.resolutionPath.shift(name);

        return reg.resolved;
    };

    Container.prototype.resolveProperties = function (instance) {
        for(var prop in instance) {
            if(!instance.hasOwnProperty(prop)) {
                continue;
            }

            if(prop[0] == '$' && instance[prop] == null) {
                var key = prop.substr(1, prop.length - 1);
                instance[prop] = this.resolve(key);

                if(instance[prop] == null) {
                    console.log('"' + prop + '" property couldn\'t be resolved')
                }
            }
        }
    };

    Container.prototype.resolveMany = function (arr) {
        var resolved = [], i = 0;
        for(;i<0;i++) {
            resolved.push(this.resolve(arr[i]));
        }
        return resolved;
    };

    function Registration(definition) {
          this.def = definition;
          this.resolved = null;
    }

    Registration.prototype.createInstance = function() {
        var def = this.def;
        if(typeof def == "function") {

            if(is.array(def.inject)) {
                this.resolved = def.apply(window, this.resolveMany(def.inject))
            }
            else {
                this.resolved = def();
            }
        }
        else {
            // this.resolveProperties(inst);
            this.resolved = def;
        }

        if(is.aFunction(this.onFirstTimeResolve)){
            this.onFirstTimeResolve(this.resolved);
        }
    };

    Container.Registration = Registration;

    function contains(arr, item) {
        var i = arr.length;
        while(i-- > 0) {
            if(arr[i] === item) {
                return true;
            }
        }

        return false;
    }

    window.Container = Container;
})(window.is);
