(function(core){
    "use strict";

    var html = {};
    var should = core.should;

    html.element = function(template, model) {
        var el = document.createElement('div');
        el.innerHTML = html.template(template, model);
        return el.children[0];
    };

    html.template = function(template, model) {
        should.beString(template, "template");
        var regex = /(?:{([^}]+)})/g, htmlText;
        if(model == null){
            htmlText = template;
        } else {
            htmlText =  template.replace(regex, function(m, g1) {
                return html.escapeHtml(model[g1]);
            });
        }

        return htmlText;
    };

    html.compileTemplate = function (template) {
        var regex = /(?:{([^}]+)})/g;

        var sb = [];

        sb.push('(function() {')
        sb.push('return function (m) { ')
        sb.push('\tvar html = [];')
        var m, index = 0;
        while ((m = regex.exec(template)) !== null) {
            if(m.index > index) {
                sb.push("\t\thtml.push('" + normalize(template.substr(index, m.index - index)) + "');");
            }
            sb.push(replaceToken(m[1]));
            index = m.index + m[0].length;
        }

        if(index < template.length - 1) {
            sb.push("\t\thtml.push('" + normalize(template.substr(index, template.length - index)) + "');");
        }
        sb.push("\treturn html.join('');");
        sb.push('}');
        sb.push('})()');
        //console.log(eval(sb.join('\r\n')).toString());
        return eval(sb.join('\r\n'));
    };

    function normalize(str) {
        return str.replace(/(\r|\n)+/g, '').replace("'", "\\\'");
    }

    html.escapeHtml = function(obj) {
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


    function replaceToken(token, indent) {
        if(token.indexOf('each') == 0) {
            var r = /([\w\.]+)\sin\s([\w\.]+)/g;
            var m = r.exec(token);
            var v = m[1];
            var col = m[2];

            return 'var '+ v + '_list = '+ col + '.slice(), ' + v + ';\r\nwhile(('+v+'='+v+'_list.splice(0,1)[0])!==undefined)\r\n{';
        }

        if(token == '/') {
            return "}";
        }

        return '\t\thtml.push(' + token + ');'
    }

    core.html = html;

})(window.core);