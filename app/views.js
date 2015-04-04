// Expression View
app.compose(function () {

    var formatter = app.component('formatter');
    var calc = app.component('calc');
    var html = app.component('html');

    app.modelView(app.models.BitwiseOperation, {
        renderView: function(expr) {
            var maxLen = getBinaryLength([expr.operand1, expr.operand2, expr.result]);

            expr.operand1Binary = formatter.toBinaryString(expr.operand1, maxLen);
            expr.operand2Binary = formatter.toBinaryString(expr.operand2, maxLen);
            expr.resultBinary = formatter.toBinaryString(expr.result, maxLen);

            var templateId = /<<|>>/.test(expr.sign) ? 'shiftExpressionView' : 'binaryExpressionView';
            var htmlTpl = document.getElementById(templateId).innerHTML;
            var el = html.element(htmlTpl, expr);

            colorizeBits(el);
            return el;
        }
    });

    app.modelView(app.models.BitwiseNumbers, {
        renderView: function(model) {
            var maxLen = getBinaryLength(model.numbers);
            var table = html.element('<table class="expression"></table>');

            if(app.emphasizeBytes) {
                if(maxLen % 8 != 0) {
                    maxLen += Math.floor(maxLen / 8) + 8;
                }
            }

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
        renderView: function(model) {
            var template = document.getElementById('helpView').innerHTML;
            return html.element(template);
        }
    });

    app.modelView(app.models.ErrorResult, {
        renderView: function(model) {
            return html.element('<div class="error">{message}</div>', model);
        }
    });

    app.modelView(app.models.DisplayResult, {
        renderView: function(model) {
            var resultView = html.element(document.getElementById('resultView').innerHTML, model);
            var contentView = app.buildViewFor(model.content);

            resultView.querySelector('.content').appendChild(contentView);
            return resultView;
        }
    });

    function getBinaryLength(arr) {
        var bits = calc.maxNumberOfBits(arr);
        if(app.emphasizeBytes && bits % 8 != 0) {
            if(bits < 8) {
                return 8;
            }

            var n = bits - (bits % 8);
            return n + 8;
        }
        return bits;
    }

    function colorizeBits(container) {
        var list = container.querySelectorAll('.bin');
        Array.prototype.forEach.call(list, function(el){
            var bin = el.innerText;

            el.innerHTML = bin
                .replace(/(\d{8})/g, '<span class="byte">$1</span>')
                .replace(/0/g, '<span class="zero">0</span>')
                .replace(/1/g, '<span class="one">1</span>');
        });
    }
});

