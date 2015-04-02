// Expression View
(function(app) {

    var formatter = app.service('formatter');
    var calc = app.service('calc');

    function ExpressionView(expression) {
        this.expression = expression;
    }

    ExpressionView.prototype.getViewElement = function () {
           var expr = this.expression,
               hb = app.service('html').builder(),
               result = expr.result(),
               maxLen = calc.maxNumberOfBits(expr.operand1, expr.operand2, result);

        hb.element('table', { class: "expression", cellspacing: "0"}, function () {
            buildRow(hb, expr.operand1, formatter.toBinaryString(expr.operand1, maxLen));
            buildRow(hb, expr.operand2, formatter.toBinaryString(expr.operand2, maxLen));
            buildRow(hb, expr.string, formatter.toBinaryString(result, maxLen), { class: 'result'});
        });

        return hb.toHtmlElement();
    };

    function buildRow(hb, label, binaryStr, attrs) {
        hb.element('tr', attrs, function() {
            hb.element('td', { class: "label"}, label);
            appendBinaryColumns(hb, binaryStr);
        });
    }

    function appendBinaryColumns(hb, binaryStr) {
        var css;
        for(var i=0;i<binaryStr.length;i++) {
            css = binaryStr[i] == '1' ? 'one' : 'zero';
            hb.element('td', { class: css }, binaryStr[i]);
        }
    }

    app.views.ExpressionView = ExpressionView;

})(window.app);

// Help View
(function(app){
    function HelpView(commands) {
        this.commands = commands;
    }

    HelpView.prototype.getViewElement = function() {
        var hb = app.service('html').builder();
        var commands = this.commands;
        hb.element('ul', { class: 'result' }, function() {
            commands.forEach(function(c) {
                hb.element('li', c.name + " — " + c.description);
            });});
        return hb.toHtmlElement();
    };

    app.views.HelpView = HelpView;

})(window.app);

