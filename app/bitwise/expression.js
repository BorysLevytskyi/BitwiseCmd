app.compose(function() {
    "use strict";

    var twoOperandsRegex = /^(\d+)\s*(<<|>>|\||\&|\^)\s*(\d+)$/;
    var numbersList = /^((\d*)+\s?)+$/;

    app.set('expression', {
        canParse: function(string) {
            return twoOperandsRegex.test(string) || numbersList.test(string);
        },
        parse: function(string) {
            var trimmed = string.replace(/^\s+|\s+$/, '');
            var matches = twoOperandsRegex.exec(trimmed);

            if(matches != null) {
                return createCalculableExpression(matches);
            }

            matches = numbersList.exec(string);
            if(matches != null) {
                return createListOfNumbersExpression(string)
            }

        }
    });

    function createCalculableExpression(matches) {

        var o1 = parseInt(matches[1], 10);
        var o2 = parseInt(matches[3], 10);

        var m = new app.models.BitwiseOperation();
        m.operand1 = o1;
        m.operand2 = o2;
        m.sign = matches[2];
        m.string = matches.input;
        m.result = eval(matches.input);

        return m;
    }

    function createListOfNumbersExpression(input) {
        var numbers = [];
        input.split(' ').forEach(function(n){
            if(n.trim().length > 0) {
                numbers.push(parseInt(n));
            }

        });

        return new app.models.BitwiseNumbers(numbers);
    }
});