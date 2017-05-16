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

        Array.prototype.forEach.call(els, function (element) {
            var key = element.getAttribute('data-template');

            if (store[key] instanceof Template) {
                console.warn(key + ' templates already registered');
                return;
            }

            var template = new Template(element.innerHTML);
            store[key] = template;

            if (element.hasAttribute('data-compiled')) {
                template.process = app.get('html').compileTemplate(template.html);
                template.isCompiled = true;
            }
        });
    }
})(window.app);
