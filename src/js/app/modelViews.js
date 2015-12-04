// Expression View

app.compose(function () {
    "use strict";


    var formatter = app.get('formatter');
    var calc = app.get('calc');
    var html = app.get('html');
    var cmdConfig = app.get('cmdConfig');
    var expression = app.get('expression');

    // TODO: move to protojs
    String.prototype.padLeft = function(size, char) { return formatter.padLeft(this, size, char); }

    app.modelView(app.models.BitwiseExpressionViewModel, {
        renderView: function(model) {
            var template = app.template('bitwiseExpressionView');
            return colorizeBits(template.render(model));
        }
    });

    app.modelView(app.models.BitwiseNumbersViewModel, {
        renderView: function(model) {
            model.bitsSize = getBinaryLength(model.numbers);
            var templateElement = colorizeBits(app.template('numbersList').render(model));
            var list = templateElement.querySelectorAll('.bit');

            Array.prototype.forEach.call(list, function(el) {
                el.classList.add('flipable');
                el.setAttribute('title', 'Click to flip this bit');
                el.addEventListener('click', flipBits);
            });

            return templateElement;
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

            if(cmdConfig.emphasizeBytes) {
                bin = bin.replace(/(\d{8})/g, '<span class="byte">$1</span>');
            }

            el.innerHTML = bin
                .replace(/0/g, '<span class="bit zero">0</span>')
                .replace(/1/g, '<span class="bit one">1</span>');
        });
        return container;
    }

    function flipBits(evt) {
        var el = evt.target;
        var content = el.textContent;
        if(content == '0') {
            el.innerHTML = '1';
            el.classList.remove('zero');
            el.classList.add('one');
        } else {
            el.innerHTML = '0';
            el.classList.add('zero');
            el.classList.remove('one');
        }

        var row = findParent(el, 'TR');
        var value = parseInt(row.cells[1].textContent, 2);
        var kind = row.dataset.kind;

        row.cells[0].innerHTML = expression.Operand.toKindString(value, kind);
        row.cells[2].innerHTML = expression.Operand.toKindString(value, expression.Operand.getOtherKind(kind));
    }

    function findParent(el, tagName) {
        var parent = el.parentNode;
        while(parent.tagName != tagName) {
            parent = parent.parentNode;
        }
        return parent;
    }
});

