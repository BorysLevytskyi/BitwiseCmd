app.set('expression', function() {
    "use strict";

    var exprRegex = /^(-?(?:\d+|0x[\d,a-f]+))\s*(<<|>>|>>>|\||\&|\^)\s*(-?(?:\d+|0x[\d,a-f]+))$/;
    var listRegex = /^(-?(?:\d+|0x[\d,a-f]+)\s?)+$/;
    var notRex = /^(~)(-?(?:\d+|0x[\d,a-f]+))$/;

    var expression = {
        canParse: function(string) {
            return exprRegex.test(string) || listRegex.test(string) || notRex.test(string)
        },
        parse: function(string) {
            var trimmed = string.replace(/^\s+|\s+$/, '');

            var matches = exprRegex.exec(trimmed);

            if(matches != null) {
                return createTwoOperandExpr(matches);
            }

            matches = notRex.exec(trimmed);
            if(matches != null) {
                return createSingleOperandExpr(matches);
            }

            matches = listRegex.exec(string);
            if(matches != null) {
                return createListOfNumbersExpression(string)
            }

        },
        parseOperand: function(input) {
            return new Operand(input);
        },
        createOperand: function(number, kind) {
            var str = number.toString(getBase(kind));
            if(kind == 'hex') {
                str = toHex(str);
            }

            return new Operand(str);
        },
        TwoOperandExpression: TwoOperandExpression,
        SingleOperandExpression: SingleOperandExpression,
        ListOfNumbersExpression: ListOfNumbersExpression
    };

    function createTwoOperandExpr(matches) {

        var operand1 = new Operand(matches[1]),
            operand2 = new Operand(matches[3]),
            sign = matches[2],
            expressionString = matches.input;

        return new TwoOperandExpression(expressionString, operand1, operand2, sign);
    }

    function createSingleOperandExpr(matches) {
        var operand = new Operand(matches[2])
        return new SingleOperandExpression(matches.input, operand, matches[1]);
    }

    function createListOfNumbersExpression(input) {
        var numbers = [];
        input.split(' ').forEach(function(n){
            if(n.trim().length > 0) {
                numbers.push(new Operand(n.trim()));
            }
        });

        return new ListOfNumbersExpression(input, numbers);
    }

    function getBase(kind) {
        switch (kind){
            case 'bin': return 2;
            case 'hex': return 16;
            case 'dec': return 10;
        }
    }

    function toHex(hex) {
        return hex.indexOf('-') == 0 ? '-0x' + hex.substr(1) : '0x' + hex;
    }

    function Operand(input) {
        this.input = input;
        this.value = parseInt(input);
        this.hex = toHex(this.value.toString(16));
        this.dec = this.value.toString(10);
        // >>> 0 makes negative numbers like -1 to be displayed as '11111111111111111111111111111111' in binary instead of -1
        this.bin = this.value < 0 ? (this.value >>> 0).toString(2) : this.value.toString(2);
        this.kind = this.input.indexOf('0x') > -1 ? 'hex' : 'dec';
        this.other = this.kind == 'dec' ? this.hex : this.dec;
    }

    function SingleOperandExpression(expressionString, operand, sign) {
        this.expressionString = expressionString;
        this.operand1 = operand;
        this.sign = sign;
    }

    function TwoOperandExpression(expressionString, operand1, operand2, sign) {
        this.expressionString = expressionString;
        this.operand1 = operand1;
        this.operand2 = operand2;
        this.sign = sign;
    }

    function ListOfNumbersExpression(expressionString, numbers) {
        this.expressionString = expressionString;
        this.numbers = numbers;
    }

    function Expression() {
    }

    Expression.prototype.toString = function() {
        return this.expressionString ? "Expression: " + this.expressionString : this.toString();
    };

    //TwoOperandExpression.prototype = Expression.prototype;
    //SingleOperandExpression.prototype = Expression.prototype;
    //ListOfNumbersExpression.prototype = Expression.prototype;

    return expression;
});