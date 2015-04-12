(function(app) {
    "use strict";

    function BitwiseOperation () {
    }

    BitwiseOperation.prototype.calculate = function () {
        return eval(this.string);
    };

    function BitwiseNumbers(operands) {
        this.operands = operands;
        var numbers = this.numbers = [];

        operands.forEach(function (o) {
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
