import * as _ from 'lodash';

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
        Operand:Operand,
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

export class Operand {
        constructor(input) {
            this.input = input;
            this.value = parseInt(input);
            this.hex = Operand.toHexString(this.value.toString(16));
            this.dec = this.value.toString(10);
            // >>> 0 makes negative numbers like -1 to be displayed as '11111111111111111111111111111111' in binary instead of -1
            this.bin = this.value < 0 ? (this.value >>> 0).toString(2) : this.value.toString(2);
            this.kind = this.input.indexOf('0x') > -1 ? 'hex' : 'dec';
            this.other = this.kind == 'dec' ? this.hex : this.dec;
            this.lengthInBits = Operand.getBitLength(this.value);
        }
                
        getLengthInBits() {
            if(this.value < 0) {
                return 32;
            }
            return Math.floor(Math.log(this.value) / Math.log(2)) + 1;
        };

        

     getOtherKind(kind) {
        switch(kind || this.kind) {
            case 'dec': return 'hex';
            case 'hex': return 'dec';
            default : throw new Error(kind + " kind doesn't have opposite kind")
        }
    };

    toString() {
        return this.input;
    }

    setValue(value) {
        console.log('Before ' + value, this);
        this.value = value;
        this.bin = Operand.toKindString(this.value, 'bin');
        this.dec = Operand.toKindString(this.value, 'dec');
        this.hex = Operand.toKindString(this.value, 'hex');
        this.other = Operand.toKindString(this.value, this.getOtherKind());
        this.input = Operand.toKindString(this.value, this.kind);
        console.log('After ' + value, this);
    }
        
    static getBitLength(num) {
        return Math.floor(Math.log(num) / Math.log(2)) + 1
    }    
    
    static getBase(kind){
        switch (kind){
            case 'bin': return 2;
            case 'hex': return 16;
            case 'dec': return 10;
        }
    };

    static create(number, kind) {
        var str = number.toString(Operand.getBase(kind));
        if(kind == 'hex') {
            str = Operand.toHexString(str);
        }

        return new Operand(str);
    };

    static toKindString(value, kind) {
            switch(kind) {
                case 'hex':
                    var hexVal = Math.abs(value).toString(16);
                    return value >= 0 ? '0x' + hexVal : '-0x' + hexVal;
                case 'bin':
                    return (value>>>0).toString(2);
                case 'dec':
                    return value.toString(10);
                default:
                    throw new Error("Unexpected kind: " + kind)
            }
        };

    static toHexString (hex) {
            return hex.indexOf('-') == 0 ? '-0x' + hex.substr(1) : '0x' + hex;
     };
}

export class SingleOperandExpression {
    constructor(expressionString, operand, sign) {
        this.expressionString = expressionString;
        this.operand1 = operand;
        this.sign = sign;
    }
    
    apply(value) {
          var str = '';
          if(this.sign == '~'){
              str = '~' + this.operand1.value;
          } else {
              str = value + this.sign + this.operand1.value
          }

         return Operand.create(eval(str), this.operand1.kind);
    };

    isShiftExpression() {
        return this.sign.indexOf('<') >= 0 || this.sign.indexOf('>')>= 0;
    };

    toString() {
        return this.sign + this.operand1.toString();
    }
}

export class TwoOperandExpression {
    constructor(expressionString, operand1, operand2, sign) {
        this.expressionString = expressionString;
        this.operand1 = operand1;
        this.operand2 = operand2;
        this.sign = sign;
    }
}

export class MultipleOperandsExpression {
    constructor(expressionString, expressions) {
        this.expressionString = expressionString;
        this.expressions = expressions;
    }
}

export class ListOfNumbersExpression {
    constructor(expressionString, numbers) {
        this.expressionString = expressionString;
        this.numbers = numbers;
        this.maxBitsLegnth = _.chain(numbers).map(n => n.lengthInBits).reduce((n , c) => n >= c ? n : c, 0).value();
    }

    toString() {
        return this.numbers.map(n => n.value.toString()).join(' ');
    }
}

export class Expression {
    toString() {
        return this.expressionString ? "Expression: " + this.expressionString : this.toString();
    };
}
  
export var parser = expression;