app.set('expression', function() {
    "use strict";

    var expression = {
        factories:[],
        canParse: function(string) {
            var i = this.factories.length-1;
            for(;i>=0;i--) {
                if(this.factories[i].regex.test(string)){
                    return true;
                }
            }
            return false;
        },
        parse: function(string) {

            var trimmed = string.replace(/^\s+|\s+$/, '');
            var i = 0, l = this.factories.length, factory, matches;

            for(;i<l;i++) {
                factory = this.factories[i];
                matches = factory.regex.exec(trimmed);

                if(matches == null){
                    continue;
                }

                return factory.create(matches);
            }

            return null;
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
        addFactory: function(factory) {
          this.factories.push(factory);
        },
        TwoOperandExpression: TwoOperandExpression,
        SingleOperandExpression: SingleOperandExpression,
        ListOfNumbersExpression: ListOfNumbersExpression
    };

    // List of numbers
    expression.addFactory({
        regex: /^(-?(?:\d+|0x[\d,a-f]+)\s?)+$/,
        create: function (matches) {
            var numbers = [],
                input = matches.input;

            input.split(' ').forEach(function(n){
                if(n.trim().length > 0) {
                    numbers.push(new Operand(n.trim()));
                }
            });

            return new ListOfNumbersExpression(input, numbers);
        }
    });

    // Not Expression
    expression.addFactory({
        regex: /^(~)(-?(?:\d+|0x[\d,a-f]+))$/,
        create: function (matches) {
            var operand = new Operand(matches[2])
            return new SingleOperandExpression(matches.input, operand, matches[1]);
        }
    });

    // Two operands expression
    expression.addFactory({
        regex: /^(-?(?:\d+|0x[\d,a-f]+))\s*(<<|>>|>>>|\||\&|\^)\s*(-?(?:\d+|0x[\d,a-f]+))$/,
        create:  function (matches) {

            var operand1 = new Operand(matches[1]),
                operand2 = new Operand(matches[3]),
                sign = matches[2],
                expressionString = matches.input;

            return new TwoOperandExpression(expressionString, operand1, operand2, sign);
        }
    });

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