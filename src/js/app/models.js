(function(app) {
    "use strict";

    function BitwiseOperation (expr) {
        this.expression = expr;
        this.operand1 = expr.operand1;
        this.operand2 = expr.operand2;
        this.sign = expr.sign;
        this.string = expr.expressionString;
    }

    function BitwiseNumbers(expr) {
        this.expression = expr;
        this.operands = expr.numbers;

        var numbers = this.numbers = [];

        expr.numbers.forEach(function (o) {
           numbers.push(o.value);
        });
    }

    function BitwiseExpression() {
        this.items = [];
        this.maxNumberOfBits = 0;
    }

    BitwiseExpression.buildMultiple = function (expr) {
        var op = expr.expressions[0],
            i = 1, l = expr.expressions.length,
            ex, m = new BitwiseExpression();

        m.addOperand(op);

        for (;i<l;i++) {
            ex = expr.expressions[i];
            op = ex.apply(op.value);

            if(ex.isShiftExpression()){
                m.addShiftExpressionResult(ex, op);
            } else {
                m.addExpression(ex);
                m.addExpressionResult(op);
            }
        }

        m.maxNumberOfBits = m.emphasizeBytes(m.maxNumberOfBits);
        return m;
    };

    BitwiseExpression.buildNot = function (expression) {
        var m = new BitwiseExpression();
        m.addExpression(expression);
        m.addExpressionResult(expression.apply());
        m.maxNumberOfBits = m.emphasizeBytes(m.maxNumberOfBits);
        return m;
    };

    BitwiseExpression.prototype.addOperand = function(operand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ sign:'', label: operand.toString(), bin: operand.bin, other: operand.other, css: ''});
    };

    BitwiseExpression.prototype.addExpression = function(expression) {
        this.maxNumberOfBits = Math.max(expression.operand1.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ sign: expression.sign, label: expression.operand1.input, bin: expression.operand1.bin, other: expression.operand1.other, css: ''});
    };

    BitwiseExpression.prototype.addShiftExpressionResult = function(expression, resultOperand) {
        this.maxNumberOfBits = Math.max(resultOperand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({
            sign: expression.sign + expression.operand1.input,
            label: resultOperand,
            bin: resultOperand.bin,
            other: resultOperand.other,
            css: 'expression-result'});
    };

    BitwiseExpression.prototype.addExpressionResult = function(operand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ sign:'=', label: operand.toString(), bin: operand.bin, other: operand.other, css: 'expression-result'});
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
