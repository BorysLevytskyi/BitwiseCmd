// Expression View
(function(app) {

    var formatter = app.service('formatter');
    var calc = app.service('calc');

    app.modelView(app.models.BitwiseOperation, {
        $html:null,
        renderView: function(model) {
            return renderCalculableExpression(model, this.$html.builder());
        }
    });

    app.modelView(app.models.BitwiseNumbers, {
        $html:null,
        renderView: function(model) {
            return renderListOfNumbers(model.numbers, this.$html.builder());
        }
    });

    function renderCalculableExpression(expr, hb) {
        var maxLen = calc.maxNumberOfBits([expr.operand1, expr.operand2, expr.result]);

        hb.element('table', { class: "expression", cellspacing: "0"}, function () {
            buildRow(hb, expr.operand1, formatter.toBinaryString(expr.operand1, maxLen));
            buildRow(hb, expr.operand2, formatter.toBinaryString(expr.operand2, maxLen));
            buildRow(hb, expr.result, formatter.toBinaryString(expr.result, maxLen), { class: 'result'});
        });

        return hb.toHtmlElement();
    }

    function renderListOfNumbers(numbers, hb) {
        var maxLen = calc.maxNumberOfBits(numbers);

        hb.element('table', { class: "expression", cellspacing: "0"}, function () {
            numbers.forEach(function(o){
                buildRow(hb, o, formatter.toBinaryString(o, maxLen));
            });
        });

        return hb.toHtmlElement();
    }

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

    app.modelView(app.models.HelpResult, {
        $html: null,
        renderView: function(model) {
            var hb = this.$html.builder();
            var commands = model.commands;
            hb.element('ul', { class: 'help' }, function() {
                commands.forEach(function(c) {
                    hb.element('li', c.name + " — " + c.description);
                });});
            return hb.toHtmlElement();
        }
    });

    app.modelView(app.models.ErrorResult, {
        $html: null,
        renderView: function(model) {
            return this.$html.element('<div class="error">{message}</div>', model);
        }
    });

    app.modelView(app.models.DisplayResult, {
        $html: null,
        renderView: function(model) {
            var resultView = this.$html.element(
                '<div class="result">' +
                    '<div class="input">{input}</div>' +
                    '<div class="payload"></div>' +
                '</div>', model);

            var payloadView = app.buildViewFor(model.payload);
            resultView.childNodes[1].appendChild(payloadView);
            return resultView;
        }
    });

})(window.app);

