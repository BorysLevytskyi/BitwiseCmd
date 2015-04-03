(function() {
    var twoOperandsRegex = /^(\d+)(<<|>>|\||\&|\^)(\d+)$/;
    var numbersList = /^((\d*)+\s?)+$/;

    app.service('expression', {
        parse: function(string) {
            var trimmed = string.replace(/^\s+|\s+$/, '');
            var matches = twoOperandsRegex.exec(trimmed);

            if(matches != null) {
                return createCalculableExpression(matches);
            }

            matches = numbersList.exec(string);
            if(matches != null) {
                return createListOfNumbersExpression(matches)
            }

        }
    });

    function createCalculableExpression(matches) {

        var o1 = parseInt(matches[1], 10);
        var o2 = parseInt(matches[3], 10);

        return {
            string: matches.input,
            operand1: o1,
            sign: matches[2],
            operand2: o2,
            calculate: function() {
                return eval(this.string);
            }
        }
    }

    function createListOfNumbersExpression(matches) {
        var numbers = [], i=0;

        for(;i<matches.length; i++) {
            numbers.push(parseInt(matches[i], 10));
        }

        return {
            string:matches.input,
            operands: numbers
        }
    }

})(window.app);