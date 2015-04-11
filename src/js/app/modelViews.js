// Expression View
app.compose(function () {
    "use strict";

    var formatter = app.get('formatter');
    var calc = app.get('calc');
    var html = app.get('html');
    var cmdConfig = app.get('cmdConfig');
    var expression = app.get('expression');

    app.modelView(app.models.BitwiseOperation, function() {
        function getTemplateId(model) {
            switch (model.sign) {
                case '<<':
                case '>>':
                case '>>>':
                    return 'shiftExpressionView';
                case '~':
                    return 'notExpressionView';
                default:
                    return 'binaryExpressionView';
            }
        }

        return {
            renderView: function(expr) {

                var result = expression.createOperand(calc.calcExpression(expr), getResultMode([expr.operand1, expr.operand2]));
                var maxLen = getBinaryLength([expr.operand1.value, expr.operand2 != null ? expr.operand2.value : 0, result.value]);

                var model = Object.create(expr);
                model.result = result;
                model.operand1Binary = formatter.padLeft(expr.operand1.bin, maxLen);
                if(expr.operand2) {
                    model.operand2Binary = formatter.padLeft(expr.operand2.bin, maxLen);
                }
                model.resultBinary = formatter.padLeft(model.result.bin, maxLen);

                var templateId = getTemplateId(model);
                var template = app.template(templateId);

                var el = template.render(model);
                colorizeBits(el);
                return el;
            }
        }
    });

    app.modelView(app.models.BitwiseNumbers, {
        renderView: function(model) {
            var maxLen = getBinaryLength(model.numbers);
            var table = html.element('<table class="expression"></table>');

            model.operands.forEach(function(n){

                var row = table.insertRow();
                var decCell = row.insertCell();

                decCell.classList.add('label');

                var binCell = row.insertCell();
                binCell.className = 'bin';

                decCell.textContent = n.input;
                binCell.textContent = formatter.padLeft(n.bin, maxLen);

                var otherCell = row.insertCell();
                otherCell.className = 'other';
                otherCell.textContent = n.other;
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

    function getResultMode(operands) {
        for(var i=0; i<operands.length; i++) {
            if(operands[i] != null && operands[i].kind == 'hex') {
                return 'hex';
            }
        }

        return 'dec';
    }
});

