// Problems: no check for the circular references

(function(){
    function Container(store) {
        this.store = {};
    }

    Container.prototype.register = function(name, inst) {
        var reg = this.store[name];
        if(reg == null) {
            reg = this.store[name] = { instance: inst };
        }
        console.log(name + ' component registered');
        return reg;
    };

    Container.prototype.resolve = function(name) {
        var reg = this.store[name];
        if(reg == null) {
            throw new Error(name + ' component is not registered');
        }

        if(reg.resolved == null) {
            var inst = reg.instance;
            this.resolveProperties(inst);
            reg.resolved = inst;
        }

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

    window.Container = Container;
})();
