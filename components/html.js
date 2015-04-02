(function(){

    function HtmlBuilder() {
        this.sb = [];
    }

    HtmlBuilder.prototype.element = function(tagName, arg) {
        var attrs = typeof arg == "object" ? arg : { html: arg},
            elementContent = attrs.html || '';

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
        var el = document.createElement('div');
        el.innerHTML = this.toString();
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
            str.push(key + '="' + attr[key] + '"');
        }

        return str.join(' ');
    }

    window.HtmlBuilder = HtmlBuilder;

})();