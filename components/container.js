(function(should){
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

    // TODO: Check for circular - dependencies
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

        console.log(name + ' resolved', reg.resolved);
        return reg.resolved;
    };

    Container.prototype.resolveProperties = function (instance) {
        for(var property in instance) {
            if(property[0] == '$') {
                var name = property.substr(1, property.length - 1);
                instance[property] = this.resolve(name);

                if(instance[property] == null) {
                    console.log('"' + property + '" property couldn\'t be resolved')
                }
            }
        }
    };

    window.Container = Container;
})();
