import NumericOperand from './NumericOperand';
import ExpressionOperand from './ExpressionOperand'
import ListOfNumbersExpression from './ListOfNumbersExpression';
import BitwiseOperationExpression from './BitwiseOperationExpression';
import { ExpressionInput, ExpressionInputItem, NumberBase } from './expression-interfaces';

export { default as NumericOperand } from './NumericOperand';
export { default as ExpressionOperand } from './ExpressionOperand';
export { default as ListOfNumbersExpression } from './ListOfNumbersExpression';
export { default as BitwiseOperationExpression } from './BitwiseOperationExpression';

interface IExpressionParserFactory {
    canCreate: (input: string) => boolean;
    create: (input: string) => ExpressionInput;
};

class ExpressionParser {
    factories: IExpressionParserFactory[];
    constructor() {
        this.factories = [];
    };

    canParse (input: string) : boolean {
        var trimmed = input.replace(/^\s+|\s+$/, '');
        var i = this.factories.length-1;
        for(;i>=0;i--) {
            if(this.factories[i].canCreate(trimmed) === true){
                return true;
            }
        }
        return false;
    };

    parse (input: string) : ExpressionInput | null {
        var trimmed = input.replace(/^\s+|\s+$/, '');
        var i = 0, l = this.factories.length, factory;

        for(;i<l;i++) {
            factory = this.factories[i];

            if(factory.canCreate(trimmed) == true){
                return factory.create(trimmed);
            }
        }

        return null;
    };
    
    parseOperand (input : string) : NumericOperand {
        return NumericOperand.parse(input);
    };

    createOperand (number : number, base : NumberBase) : NumericOperand {
        return NumericOperand.create(number, base);
    };

    addFactory (factory: IExpressionParserFactory) {
      this.factories.push(factory);
    }
}

class ListOfNumbersExpressionFactory implements IExpressionParserFactory
{
    regex: RegExp;

    constructor() {
        this.regex = /^(-?(?:\d+|0x[\d,a-f]+|0b[0-1])\s?)+$/;
    }

    canCreate (input: string): boolean {
        return this.regex.test(input);
    };

    create (input : string) : ExpressionInput {
        var matches = this.regex.exec(input) as RegExpExecArray;
        var numbers = [] as NumericOperand[];
        var input = matches.input;

        input.split(' ').forEach((n: string) => {
            if(n.trim().length > 0) {
                numbers.push(NumericOperand.parse(n.trim()));
            }
        });

        return new ListOfNumbersExpression(input, numbers);
    }
}

class BitwiseOperationExpressionFactory implements IExpressionParserFactory {
    fullRegex: RegExp;
    regex: RegExp;

    constructor() {
        this.fullRegex = /^((<<|>>|>>>|\||\&|\^)?(~?-?([b,x,a-f,0-9]+)))+$/;
        this.regex = /(<<|>>|>>>|\||\&|\^)?(~?-?(?:[b,x,a-f,0-9]+))/g;
    }

    canCreate (input: string) : boolean {
        this.fullRegex.lastIndex = 0;
        return this.fullRegex.test(this.normalizeString(input));
    };

    create (input: string) : ExpressionInput {
        var m, operands : ExpressionInputItem[] = [],
            normalizedString = this.normalizeString(input);

        while ((m = this.regex.exec(normalizedString)) != null) {
            operands.push(this.parseMatch(m));
        }

        return new BitwiseOperationExpression(normalizedString, operands)
    };

    parseMatch (m:any): ExpressionInputItem {
        var input = m[0],
            sign = m[1],
            num = m[2];

        var parsed = null;
        if(num.indexOf('~') == 0) {
            parsed = new ExpressionOperand(num, NumericOperand.parse(num.substring(1)), '~');
        }
        else {
            parsed = NumericOperand.parse(num);
        }

        if(sign == null) {
            return parsed as ExpressionOperand;
        } else {
            return new ExpressionOperand(input, parsed as NumericOperand, sign);
        }
    };

    normalizeString (input : string): string {
        return input.replace(/\s+/g,'');
    };
}

var parser = new ExpressionParser();
parser.addFactory(new ListOfNumbersExpressionFactory());
parser.addFactory(new BitwiseOperationExpressionFactory());

export {parser};
