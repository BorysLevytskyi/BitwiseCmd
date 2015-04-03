(function(should){
    function Container(store) {
        this.store = {};
        this.resolved = {};
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
            throw new Error(''); // TODO: wrote
        }

        if(reg.resolved == null) {
            var inst = reg.instance;
            this.resolveProperties(inst);
            reg.resolved = inst;
        }

        return reg.resolved;
    };

    Container.prototype.resolveProperties = function (instance) {
        for(var property in instance) {
            if(property[0] == '$') {
                var name = property.substr(1, property.length - 1);
                instance[property] = this.resolve(name);
            }
        }
    };

    window.Container = Container;
})();
