(function(app, core){
    "use strict";

    app.set('html', core.html);
    app.set('is', core.is);
    app.set('should', core.should);
    app.set('bindr', core.bindr);

    app.set('hash', function () {
        return {
            encodeHash: function(string) {
                return encodeURI(string.trim().replace(/\s/g,','));
            },
            decodeHash: function(hashValue) {
                return decodeURI(hashValue).replace(/^\#/, '').replace(/,/g,' ');
            },
            getArgs: function (hashValue) {

                core.should.beString(hashValue, 'hashValue');

                var decodedHash = this.decodeHash(hashValue),
                    args = {
                        commands: []
                    };

                splitHashList(decodedHash).forEach(function(value) {
                    if(/^\-[a-zA-Z]+$/.test(value)) {
                        args[value.substr(1)] = true;
                        return;
                    }

                    args.commands.push(value);
                });

                return Object.freeze(args);
            }
        };

        function splitHashList(str) {
            var values = [];

            if(str.indexOf('||')) {
                str.split('||').forEach(function (v) {
                    if (v.length > 0) {
                        values.push(v);
                    }
                });
            } else {
                values.push(str);
            }

            return values;
        }
    });

    app.set('hashArgs', function() {
           return app.get('hash').getArgs(window.location.hash);
    })

})(window.app, window.core);