(function(core){

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

    function getAttributesStr(attr) {
        if(attr == null) {
            return '';
        }
        var str = [];

        for(var key in attr) {
            if(key == 'html')
                continue;
            str.push(key + '="' + HtmlBuilder.escapeHtml(attr[key]) + '"');
        }

        return str.join(' ');
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

    core.HtmlBuilder = HtmlBuilder;

})(window.core);