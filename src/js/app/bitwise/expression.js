app.set('expression', function() {
    "use strict";
    var decNumber = "\d+";
    var hexNumber = "(?:\d|a|b|c|d|e|f)";

    var modes = {
        'dec': {
            expr:  /^(\d+)\s*(<<|>>|\||\&|\^)\s*(\d+)$/,
            list: /^((\d*)+\s?)+$/
        },
        'hex': {
            expr:  /^([\d,a-f]+)\s*(<<|>>|\||\&|\^)\s*([\d,a-f]+)$/,
            list: /^(([\d,a-f]*)+\s?)+$/
        }
    };

    return {
        canParse: function(string, mode) {
            var regex = modes[mode || 'dec'];
            return regex.expr.test(string) || regex.list.test(string);
        },
        parse: function(string, mode) {
            mode = (mode || 'dec');

            var trimmed = string.replace(/^\s+|\s+$/, '');
            var regex = modes[mode];
            var base = getBase(mode);
            var matches = regex.expr.exec(trimmed);

            if(matches != null) {
                return createCalculableExpression(matches, base);
            }

            matches = regex.list.exec(string);
            if(matches != null) {
                return createListOfNumbersExpression(string, base)
            }
        }
    };

    function createCalculableExpression(matches, base) {

        var o1 = parseInt(matches[1], base);
        var o2 = parseInt(matches[3], base);

        var m = new app.models.BitwiseOperation();
        m.operand1 = o1;
        m.operand2 = o2;
        m.sign = matches[2];
        m.string = matches.input;
        //m.result = eval(matches.input);

        return m;
    }

    function createListOfNumbersExpression(input, base) {
        var numbers = [];
        input.split(' ').forEach(function(n){
            if(n.trim().length > 0) {
                numbers.push(parseInt(n, base));
            }

        });

        return new app.models.BitwiseNumbers(numbers);
    }

    function getBase(mode) {
        switch (mode){
            case 'bin': return 2;
            case 'hex': return 16;
            case 'dec': return 10;
        }
    }
});