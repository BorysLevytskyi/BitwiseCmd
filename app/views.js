(function(app) {

    var formatter = app.service('formatter');
    var calc = app.service('calc');

    function ExpressionView(expression) {
        this.expression = expression;
    }

    ExpressionView.prototype.getHtml = function () {
           var expr = this.expression,
               html = app.service('html').builder(),
               result = expr.result(),
               maxLen = calc.maxNumberOfBits(expr.operand1, expr.operand2, result);

        html.element('table', { class: "expression", cellspacing: "0"}, function () {
            buildRow(html, expr.operand1, formatter.toBinaryString(expr.operand1, maxLen));
            buildRow(html, expr.operand2, formatter.toBinaryString(expr.operand2, maxLen));
            buildRow(html, expr.string, formatter.toBinaryString(result, maxLen), { class: 'result'});
        });

        return html.toString();
    };

    function buildRow(html, label, binaryStr, attrs) {
        html.element('tr', attrs, function() {
            html.element('td', { class: "label"}, label);
            appendBinaryColumns(html, binaryStr);
        });
    }

    function appendBinaryColumns(html, binaryStr) {
        var css;
        for(var i=0;i<binaryStr.length;i++) {
            css = binaryStr[i] == '1' ? 'one' : 'zero';
            html.element('td', { class: css }, binaryStr[i]);
        }
    }

    app.views.ExpressionView = ExpressionView;

})(window.app);

