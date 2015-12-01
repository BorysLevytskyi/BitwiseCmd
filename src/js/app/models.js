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

})(window.app);
