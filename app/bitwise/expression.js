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

        var m = new app.models.BitwiseOperation();
        m.operand1 = o1;
        m.operand2 = o2;
        m.sing = matches[2];
        m.string = matches.input;
        m.result = eval(matches.input);

        return m;
    }

    function createListOfNumbersExpression(matches) {
        var numbers = [], i=0;

        for(;i<matches.length; i++) {
            numbers.push(parseInt(matches[i], 10));
        }

        return app.models.BitwiseNumbers(numbers);
    }

})(window.app);