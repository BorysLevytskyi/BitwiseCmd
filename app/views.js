// Expression View
(function(app) {

    var formatter = app.component('formatter');
    var calc = app.component('calc');


    app.modelView(app.models.BitwiseOperation, {
        $html:null,
        $calc:null,
        renderView: function(expr) {
            var maxLen = this.$calc.maxNumberOfBits([expr.operand1, expr.operand2, expr.result]);
            var $html = app.component('html');

            expr.operand1Binary = formatter.toBinaryString(expr.operand1, maxLen);
            expr.operand2Binary = formatter.toBinaryString(expr.operand2, maxLen);
            expr.resultBinary = formatter.toBinaryString(expr.result, maxLen);

            var templateId = /<<|>>/.test(expr.sign) ? 'shiftExpressionView' : 'binaryExpressionView';
            var html = document.getElementById(templateId).innerHTML;
            var el =  $html.element(html, expr);

            colorizeBits(el);
            return el;
        }
    });

    app.modelView(app.models.BitwiseNumbers, {
        $html:null,
        $calc:null,
        renderView: function(model) {
            var maxLen = this.$calc.maxNumberOfBits(model.numbers);
            var table = this.$html.element('<table class="expression"></table>');

            model.numbers.forEach(function(o){

                var row = table.insertRow();
                var decCell = row.insertCell();

                decCell.className = 'label';

                var binCell = row.insertCell();
                binCell.className = 'bin';

                decCell.innerText = o;
                binCell.innerText = formatter.toBinaryString(o, maxLen);
            });

            colorizeBits(table);
            return table;
        }
    });

    app.modelView(app.models.HelpResult, {
        $html: null,
        renderView: function(model) {
            var template = document.getElementById('helpView').innerHTML;
            return this.$html.element(template);
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
            var resultView = this.$html.element(document.getElementById('resultView').innerHTML, model);
            var contentView = app.buildViewFor(model.content);

            resultView.querySelector('.content').appendChild(contentView);
            return resultView;
        }
    });

    function colorizeBits(container) {
        var list = container.querySelectorAll('.bin');
        Array.prototype.forEach.call(list, function(el){
            var bin = el.innerText;
            el.innerHTML = bin
                .replace(/0/g, '<span class="zero">0</span>')
                .replace(/1/g, '<span class="one">1</span>');
        });
    }

})(window.app);

