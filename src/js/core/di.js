(function(core){
    
    "use strict";
    var is = core.is;

    function Container(store) {
        this.store = {};
        this.resolutionStack = [];
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

        // console.log('[' + name + '] component registered');
        return reg;
    };

    Container.prototype.resolve = function(name) {
        return resolveInternal.call(this, name);
    };

    function resolveInternal(name) {
        if(contains(this.resolutionStack, name)) {
            throw new Error("Failed to resolve service: " + name + ". Circular reference: " + this.resolutionStack.join(' < '));
        }

        this.resolutionStack.unshift(name);

        // console.log('\tresolution path:' + this.resolutionStack.join(' < '));

        var reg = this.store[name];
        if(reg == null) {
            throw new Error(name + ' component is not registered');
        }

        if(reg.resolved == null) {
            reg.createInstance();
        }

        this.resolutionStack.shift();

        // console.log('\tresolution path:' + this.resolutionStack.join(' < '));

        return reg.resolved;
    }


    function Registration(definition) {
          this.def = definition;
          this.resolved = null;
    }

    Registration.prototype.createInstance = function() {
        var def = this.def;
        if(typeof def == "function") {
            this.resolved = def();
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

    core.Container = Container;
})(window.core);
