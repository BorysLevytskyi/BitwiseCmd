(function(app, core){
    "use strict";

    app.set('html', core.HtmlBuilder);
    app.set('is', core.is);
    app.set('should', core.should);
    app.set('bindr', core.bindr);

    // Save config in local store
    app.run(function() {
        var cfg = app.get('cmdConfig');
        var storeKey = 'cmdConfig';

        load();

        cfg.observe(function(property, value){
            save();
        });

        function save() {
            localStorage.setItem(storeKey,  JSON.stringify(cfg.store()));
        }

        function load() {
            var json = localStorage.getItem(storeKey), stored;
            if(core.is.string(json)) {
                stored = JSON.parse(json);
                for(var key in stored) {
                    cfg[key] = stored[key];
                }
            }
        }
    });

/*
    var template = {
        compile: function (template) {
            var regex = /(?:{([^}]+)})/g;

            var sb = [];

            sb.push('(function() {')
            sb.push('return function (model) { ')
                sb.push('\tvar html = [];')
                sb.push('\twith (model) { ')
                    var m, index = 0;
                    while ((m = regex.exec(template)) !== null) {
                        if(m.index > index) {
                            sb.push("\t\thtml.push('" + normalize(template.substr(index, m.index - index)) + "');");
                        }
                        sb.push('\t\thtml.push(' + m[1] + ');');
                        index = m.index + m[0].length;
                    }

                    if(index < template.length - 1) {
                        sb.push("\t\thtml.push('" + normalize(template.substr(index, template.length - index)) + "');");
                    }
                sb.push('\t}');
                sb.push("\treturn html.join('');");
            sb.push('}');
            sb.push('})()')
            console.log(sb.join('\r\n'));
            return eval(sb.join('\r\n'));
        }
    };

    function normalize(str) {
        return str.replace(/(\r|\n)+/g, '').replace("'", "\\\'");
    }
 */
})(window.app, window.core);