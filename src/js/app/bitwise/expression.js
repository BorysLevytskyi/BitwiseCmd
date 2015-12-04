app.set('expression', function() {
    "use strict";

    var expression = {
        factories:[],
        canParse: function(string) {
            var trimmed = string.replace(/^\s+|\s+$/, '');
            var i = this.factories.length-1;
            for(;i>=0;i--) {
                if(this.factories[i].canCreate(trimmed) === true){
                    return true;
                }
            }
            return false;
        },
        parse: function(string) {
            var trimmed = string.replace(/^\s+|\s+$/, '');
            var i = 0, l = this.factories.length, factory;

            for(;i<l;i++) {
                factory = this.factories[i];

                if(factory.canCreate(trimmed) == true){
                    return factory.create(trimmed);
                }
            }

            return null;
        },
        parseOperand: function(input) {
            return new Operand(input);
        },
        createOperand: function(number, kind) {
            return Operand.create(number, kind);
        },
        addFactory: function(factory) {
          this.factories.push(factory);
        },
        TwoOperandExpression: TwoOperandExpression,
        SingleOperandExpression: SingleOperandExpression,
        ListOfNumbersExpression: ListOfNumbersExpression,
        MultipleOperandsExpression: MultipleOperandsExpression
    };

    // List of numbers
    expression.addFactory({
        regex: /^(-?(?:\d+|0x[\d,a-f]+)\s?)+$/,
        canCreate: function(string) {
            return this.regex.test(string);
        },
        create: function (string) {
            var matches = this.regex.exec(string),
                numbers = [],
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
        canCreate: function(string) {
            return this.regex.test(string);
        },
        create: function (string) {
            var matches = this.regex.exec(string),
                operand = new Operand(matches[2]);

            return new SingleOperandExpression(matches.input, operand, matches[1]);
        }
    });

    // Multiple operands expression
    expression.addFactory({
        fullRegex: /^((<<|>>|>>>|\||\&|\^)?(-?((?:\d+(?!x))|(?:0x[\d,a-f]+))))+$/,
        regex: /(<<|>>|>>>|\||\&|\^)?(-?((?:\d+(?!x))|(?:0x[\d,a-f]+)))/g,
        canCreate: function(string) {
            this.fullRegex.lastIndex = 0;
            return this.fullRegex.test(this.normalizeString(string));
        },
        create: function (string) {
            var m, operands = [],
                normalizedString = this.normalizeString(string);

            while ((m = this.regex.exec(normalizedString)) != null) {
               operands.push(this.parseMatch(m));
            }

            return new MultipleOperandsExpression(normalizedString, operands)
        },
        parseMatch: function (m) {
            var input = m[0],
                sign = m[1],
                num = m[2];

            if(sign == null) {
                return new Operand(num);
            } else {
                return new SingleOperandExpression(input, new Operand(num), sign);
            }
        },
        normalizeString: function (string) {
            return string.replace(/\s+/g,'');
        }
    });

    function Operand(input) {
        this.input = input;
        this.value = parseInt(input);
        this.hex = Operand.toHexString(this.value.toString(16));
        this.dec = this.value.toString(10);
        // >>> 0 makes negative numbers like -1 to be displayed as '11111111111111111111111111111111' in binary instead of -1
        this.bin = this.value < 0 ? (this.value >>> 0).toString(2) : this.value.toString(2);
        this.kind = this.input.indexOf('0x') > -1 ? 'hex' : 'dec';
        this.other = this.kind == 'dec' ? this.hex : this.dec;
    }
    
    Operand.toHexString = function (hex) {
        return hex.indexOf('-') == 0 ? '-0x' + hex.substr(1) : '0x' + hex;
    };

    Operand.create = function(number, kind) {
        var str = number.toString(Operand.getBase(kind));
        if(kind == 'hex') {
            str = Operand.toHexString(str);
        }

        return new Operand(str);
    };

    Operand.prototype.getLengthInBits = function() {
        if(this.value < 0) {
            return 32;
        }
        return Math.floor(Math.log(this.value) / Math.log(2)) + 1;
    };

    Operand.getBase = function(kind){
        switch (kind){
            case 'bin': return 2;
            case 'hex': return 16;
            case 'dec': return 10;
        }
    };

    function SingleOperandExpression(expressionString, operand, sign) {
        this.expressionString = expressionString;
        this.operand1 = operand;
        this.sign = sign;
    }
    
    SingleOperandExpression.prototype.apply = function (value) {
          var str = '';
          if(this.sign == '~'){
              str = '~' + this.operand1.value;
          } else {
              str = value + this.sign + this.operand1.value
          }

         return Operand.create(eval(str), this.operand1.kind);
    };

    SingleOperandExpression.prototype.isShiftExpression = function () {
        return this.sign.indexOf('<') >= 0 || this.sign.indexOf('>')>= 0;
    };

    function TwoOperandExpression(expressionString, operand1, operand2, sign) {
        this.expressionString = expressionString;
        this.operand1 = operand1;
        this.operand2 = operand2;
        this.sign = sign;
    }

    function MultipleOperandsExpression(expressionString, expressions) {
        this.expressionString = expressionString;
        this.expressions = expressions;
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

    Operand.prototype.toString = function () {
        return this.input;
    };

    SingleOperandExpression.prototype.toString = function() {
        return this.sign + this.operand1.toString();
    };

    return expression;
});