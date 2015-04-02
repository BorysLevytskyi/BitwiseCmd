(function(app){
    app.service('html', {
        builder: function () {
            return new HtmlBuilder();
        }
    })

    function HtmlBuilder() {
        this.sb = [];
    }

    HtmlBuilder.prototype.element = function(tagName, attrs, content) {
        var attributes = arguments.length == 3 ? attrs : null,
            elementContent = arguments.length == 3 ? content : attrs;

        this.sb.push('<' + tagName + ' ' + getAttributesStr(attributes) + ">");

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

    function getAttributesStr(attr) {
        if(attr == null) {
            return '';
        }
        var str = [];

        for(var key in attr)
        {
            str.push(key + '="' + attr[key] + '"');
        }

        return str.join(' ');
    }

})(window.app);