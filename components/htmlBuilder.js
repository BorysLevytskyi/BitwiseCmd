(function(){

    function HtmlBuilder() {
        this.sb = [];
    }

    HtmlBuilder.prototype.element = function(tagName, arg1, arg2) {
        var attrs, elementContent;

        if(typeof arg1 == "object") {
            attrs = arg1;
        }
        else if(typeof arg1 == "string") {
            attrs = { html: arg1 };
        }
        else {
            attrs = {};
        }

        elementContent = attrs.html || arg2;

        this.sb.push('<' + tagName + ' ' + getAttributesStr(attrs) + ">");

        if(typeof elementContent == 'function')   {
            elementContent();
        } else if (elementContent != null) {
            this.sb.push(elementContent.toString());
        }

        this.sb.push('</' + tagName + '>');
    };

    HtmlBuilder.prototype.toString = function () {
        return this.sb.join('\r\n');
    };

    HtmlBuilder.prototype.toHtmlElement = function (){
        return HtmlBuilder.createElement(this.toString());
    };

    HtmlBuilder.createElement = function(template, model) {
        var regex = /(?:{([^}]+)})/g, html;

        if(model == null){
            html = template;
        } else {
            html =  template.replace(regex, function(m, g1) {
                return HtmlBuilder.escapeHtml(model[g1]);
            });
        }

        var el = document.createElement('div');
        el.innerHTML = html;
        return el.children[0];
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

    HtmlBuilder.escapeHtml = function(html) {
            return html
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
    };

    window.HtmlBuilder = HtmlBuilder;

})();