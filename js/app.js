(function (should) {

    var app = {};

    app.views = {};
    var services = {};

    app.service = function(name, impl) {

        should.beString(name);

        if(impl != null) {
            services[name] = impl;
            console.log(name + " service registered");
            return impl;
        }

        var svc = services[name];
        should.check(svc != null, name + " service wasn't found");
        return  svc;
    };

    window.app = app;

})(window.should);