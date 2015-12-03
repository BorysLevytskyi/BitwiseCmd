(function(app) {
    "use strict";


    function BitwiseOperation (expression) {
        this.expression = expression;
        this.operand1 = expression.operand1;
        this.operand2 = expression.operand2;
        this.sign = expression.sign;
        this.string = expression.expressionString;
    }

    function BitwiseNumbers(expression) {
        this.expression = expression;
        this.operands = expression.numbers;

        var numbers = this.numbers = [];

        expression.numbers.forEach(function (o) {
           numbers.push(o.value);
        });
    }

    function BitwiseExpression(expression) {
        this.items = [];
        this.maxNumberOfBits = 0;

        var op = expression.expressions[0],
            i = 1, l = expression.expressions.length,
            ex;

        this.addOperand(op);

        for (;i<l;i++) {
            ex = expression.expressions[i];
            this.addExpression(ex);
            op = ex.apply(op.value);
            this.addResult(op);
        }

        this.maxNumberOfBits = this.emphasizeBytes(this.maxNumberOfBits);
    }

    BitwiseExpression.prototype.addOperand = function(operand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ label: operand.toString(), bin: operand.bin, other: operand.other, css: ''});
    };

    BitwiseExpression.prototype.addExpression = function(expression) {
        this.maxNumberOfBits = Math.max(expression.operand1.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ label: expression.toString(), bin: expression.operand1.bin, other: expression.operand1.other, css: ''});
    };

    BitwiseExpression.prototype.addResult = function(operand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ label: "=" + operand.toString(), bin: operand.bin, other: operand.other, css: 'expression-result'});
    };

    BitwiseExpression.prototype.emphasizeBytes = function (bits) {
        var cmdConfig = app.get('cmdConfig');
        if(cmdConfig.emphasizeBytes && bits % 8 != 0) {
            if(bits < 8) {
                return 8;
            }

            var n = bits - (bits % 8);
            return n + 8;
        }
        return bits;
    };

    function ErrorResult(message) {
        this.message = message;
    }

    function ViewResult (template) {
        this.template = template;
    }

    function DisplayResult (input, content) {
        this.input = input;
        this.inputHash = app.get('hash').encodeHash(input);
        this.content = content;
    }

    app.models.BitwiseOperation = BitwiseOperation;
    app.models.BitwiseNumbers = BitwiseNumbers;
    app.models.ErrorResult = ErrorResult;
    app.models.ViewResult = ViewResult;
    app.models.DisplayResult = DisplayResult;
    app.models.BitwiseExpression = BitwiseExpression;

})(window.app);
