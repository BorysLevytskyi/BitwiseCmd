(function(app) {
    "use strict";

    function Template(html, isCompiled) {
        this.html = html;
        this.isCompiled = isCompiled === true;
    }

    Template.prototype.render = function (model) {
        if(this.isCompiled) {
            return app.get('html').element(this.process(model));
        }

        return app.get('html').element(this.html, model);
    };

    app.templates = [];
    app.template = function (key) {
        var tpl = this.templates[key];
        if(tpl == null) {
            throw  new Error(key + ' template is not found');
        }
        return tpl;
    };

    app.run(function() {
        readTemplates(app.get('rootView'));
    });

    function readTemplates(containerEl) {
        var els = containerEl.querySelectorAll('[data-template]');
        var store = app.templates;

        Array.prototype.forEach.call(els, function(element) {
            var key = element.getAttribute('data-template');

            if(store[key] instanceof Template) {
                console.warn(key + ' templates already registered');
                return;
            }


            var template = new Template(element.innerHTML);
            store[key] = template;

            if(element.hasAttribute('data-compiled')) {
                template.process = compile(template.html);
                template.isCompiled = true;
            }
        });


         function compile (template) {
                var regex = /(?:{([^}]+)})/g;

                var sb = [];

                sb.push('(function() {')
                sb.push('return function (m) { ')
                sb.push('\tvar html = [];')
                sb.push('console.log(m)');
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
                sb.push("\treturn html.join('');");
                sb.push('}');
                sb.push('})()');
                console.log(sb.join('\r\n'));
                return eval(sb.join('\r\n'));
            }
        };

        function normalize(str) {
            return str.replace(/(\r|\n)+/g, '').replace("'", "\\\'");
        }


})(window.app);
