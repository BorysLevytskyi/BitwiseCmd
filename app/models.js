(function(app) {

    function BitwiseOperation () {
    }

    BitwiseOperation.prototype.calculate = function () {
        return eval(this.string);
    };

    function BitwiseNumbers(numbers) {
        this.numbers = numbers;
    }

    function ErrorResult(message) {
        this.message = message;
    }

    function HelpResult (commands) {
        this.commands = commands;
    }

    function DisplayResult (input, payload) {
        this.input = input;
        this.payload = payload;
    }

    app.models.BitwiseOperation = BitwiseOperation;
    app.models.BitwiseNumbers = BitwiseNumbers;
    app.models.ErrorResult = ErrorResult;
    app.models.HelpResult = HelpResult;
    app.models.DisplayResult = DisplayResult;

})(window.app);
