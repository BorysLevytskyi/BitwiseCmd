import Operand from './expression/Operand';
import ExpressionOperand from './expression/ExpressionOperand'
import ListOfNumbersExpression from './expression/ListOfNumbersExpression';
import MultipleOperandsExpression from './expression/MultipleOperandsExpression';

export { default as Operand } from './expression/Operand';
export { default as ExpressionError } from './expression/ExpressionError';
export { default as ExpressionOperand } from './expression/ExpressionOperand';
export { default as ListOfNumbersExpression } from './expression/ListOfNumbersExpression';
export { default as MultipleOperandsExpression } from './expression/MultipleOperandsExpression';

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
            return Operand.parse(input);
        },
        createOperand: function(number, kind) {
            return Operand.create(number, kind);
        },
        addFactory: function(factory) {
          this.factories.push(factory);
        }
    };

    // List of numbers
    expression.addFactory({
        regex: /^(-?(?:\d+|0x[\d,a-f]+|0b[0-1])\s?)+$/,
        canCreate: function(string) {
            return this.regex.test(string);
        },
        create: function (string) {
            var matches = this.regex.exec(string),
                numbers = [],
                input = matches.input;

            input.split(' ').forEach(function(n){
                if(n.trim().length > 0) {
                    numbers.push(Operand.parse(n.trim()));
                }
            });

            return new ListOfNumbersExpression(input, numbers);
        }
    });

    // Multiple operands expression
    expression.addFactory({
        fullRegex: /^((<<|>>|>>>|\||\&|\^)?(~?-?([b,x,a-f,0-9]+)))+$/,
        regex: /(<<|>>|>>>|\||\&|\^)?(~?-?(?:[b,x,a-f,0-9]+))/g,
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
            console.log('match');
            console.log(m);
            var input = m[0],
                sign = m[1],
                num = m[2];

            var op = null;
            if(num.indexOf('~') == '0') {
                op = new ExpressionOperand(input, Operand.parse(num.substring(1)), '~');
            }
            else {
                op = Operand.parse(num);
            }

            if(sign == null) {
                return op;
            } else {
                return new ExpressionOperand(input, op, sign);
            }
        },
        normalizeString: function (string) {
            return string.replace(/\s+/g,'');
        }
    });

// Expressions like ~1


// Expression like 1|2 or 4^5



export var parser = expression;


export class Parser {
    constructor(input, pos) {
        this.input = input;
        this.pos = pos || 0;
        this.buffer = [];
    }

    parse() {
        console.log(this.input.length);
        while(this.pos<this.input.length) {
            this.buffer.push(this.input[this.pos]);
            this.pos++;
        }
        console.log('exit');
    }
}