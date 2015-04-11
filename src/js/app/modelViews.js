// Expression View
app.compose(function () {
    "use strict";

    var formatter = app.get('formatter');
    var calc = app.get('calc');
    var html = app.get('html');
    var cmdConfig = app.get('cmdConfig');

    app.modelView(app.models.BitwiseOperation, {
        renderView: function(expr) {
            var result = calc.calcExpression(expr);
            var maxLen = getBinaryLength([expr.operand1.value, expr.operand2.value, result]);

            var model = Object.create(expr);

            var otherMode = cmdConfig.mode == 'dec' ? 'hex' : 'dec';

            model.mode = cmdConfig.mode;
            model.otherMode = otherMode;

            model.operand1Str = expr.operand1[cmdConfig.mode];
            model.operand1Binary = formatter.padLeft(expr.operand1.bin, maxLen);
            model.operand1Other = formatter.padLeft(expr.operand1[otherMode]);

            model.operand2Str = expr.operand2[cmdConfig.mode];
            model.operand2Binary = formatter.padLeft(expr.operand2.bin, maxLen);
            model.operand2Other = expr.operand2[otherMode];

            model.resultStr = formatter.formatString(result, cmdConfig.mode);
            model.resultBinary = formatter.padLeft(formatter.formatString(result, cmdConfig.mode), maxLen);
            model.resultOther = formatter.formatString(result, otherMode);

            console.log(model);

            var templateId = /<<|>>/.test(model.sign) ? 'shiftExpressionView' : 'binaryExpressionView';
            var template = app.template(templateId);

            var el = template.render(model);
            colorizeBits(el);
            return el;
        }
    });

    app.modelView(app.models.BitwiseNumbers, {
        renderView: function(model) {
            var maxLen = getBinaryLength(model.numbers);
            var table = html.element('<table class="expression {mode}"></table>');
            var otherMode = cmdConfig.mode == 'dec' ? 'hex' : 'dec';

            model.numbers.forEach(function(n){

                var row = table.insertRow();
                var decCell = row.insertCell();

                decCell.classList.add('label');
                decCell.classList.add(cmdConfig.mode);

                var binCell = row.insertCell();
                binCell.className = 'bin';

                decCell.innerHTML = html.template('<span class="prefix">0x</span>{n}', { n: formatter.formatString(n, cmdConfig.mode) });
                binCell.textContent = formatter.padLeft(formatter.formatString(n), maxLen);

                var otherCell = row.insertCell();
                otherCell.className = 'other ' + otherMode;
                otherCell.innerHTML = html.template('<span class="prefix">0x</span>{n}', { n: formatter.formatString(n, otherMode) });
            });

            colorizeBits(table);
            return table;
        }
    });

    app.modelView(app.models.ViewResult, {
        renderView: function(model) {
            var template = app.template(model.template);
            return template.render();
        }
    });

    app.modelView(app.models.ErrorResult, {
        renderView: function(model) {
            return html.element('<div class="error">{message}</div>', model);
        }
    });

    app.modelView(app.models.DisplayResult, {
        renderView: function(model) {
            var resultView = app.template('resultView').render(model);
            var contentView = app.buildViewFor(model.content);
            resultView.querySelector('.content').appendChild(contentView);
            return resultView;
        }
    });

    function getBinaryLength(arr) {
        var bits = calc.maxNumberOfBits(arr);
        if(cmdConfig.emphasizeBytes && bits % 8 != 0) {
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
            var bin = el.textContent;

            el.innerHTML = bin
                .replace(/(\d{8})/g, '<span class="byte">$1</span>')
                .replace(/0/g, '<span class="zero">0</span>')
                .replace(/1/g, '<span class="one">1</span>');
        });
    }
});

