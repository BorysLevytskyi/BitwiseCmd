(function(core){
    "use strict";

    var HtmlBuilder = {};
    var should = core.should;

    HtmlBuilder.element = function(template, model) {
        var el = document.createElement('div');
        el.innerHTML = HtmlBuilder.template(template, model);
        return el.children[0];
    };

    HtmlBuilder.template = function(template, model) {
        should.beString(template, "template");
        var regex = /(?:{([^}]+)})/g, html;

        if(model == null){
            html = template;
        } else {
            html =  template.replace(regex, function(m, g1) {
                return HtmlBuilder.escapeHtml(model[g1]);
            });
        }

        return html;
    };

    HtmlBuilder.compileTemplate = function (template) {
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
        // console.log(sb.join('\r\n'));
        return eval(sb.join('\r\n'));
    };

    function normalize(str) {
        return str.replace(/(\r|\n)+/g, '').replace("'", "\\\'");
    }

    HtmlBuilder.escapeHtml = function(obj) {
            if(obj == null) {
                return obj;
            }

            if(typeof obj != 'string') {
                obj = obj.toString();
            }

            return obj
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
    };

    core.html = HtmlBuilder;

})(window.core);