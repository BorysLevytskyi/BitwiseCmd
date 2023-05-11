import Operand from './Operand';
import Operator from './Operator'
import ListOfNumbers from './ListOfNumbers';
import BitwiseOperation from './BitwiseOperation';
import { Expression, ExpressionElement } from './expression-interfaces';
import { numberParser } from './numberParser';

export { default as Operand } from './Operand';
export { default as Operator } from './Operator';
export { default as ListOfNumbers } from './ListOfNumbers';
export { default as BitwiseOperation } from './BitwiseOperation';

interface IExpressionParserFactory {
    canCreate: (input: string) => boolean;
    create: (input: string) => Expression;
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

    parse (input: string) : Expression | null {
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

    addFactory (factory: IExpressionParserFactory) {
      this.factories.push(factory);
    }
}

class ListOfNumbersExpressionFactory implements IExpressionParserFactory
{
    constructor() {
    }

    canCreate (input: string): boolean {
        if(input.length == 0) return false;
        
        return input.split(' ')
            .filter(p => p.length > 0)
            .map(p => numberParser.caseParse(p))
            .filter(n => n == false)
            .length == 0;
    };

    create (input : string) : Expression {
        
        const numbers = input.split(' ')
            .filter(p => p.length > 0)
            .map(m => parseScalarValue(m));

        return new ListOfNumbers(input, numbers);
    }
}

class BitwiseOperationExpressionFactory implements IExpressionParserFactory {
    fullRegex: RegExp;
    regex: RegExp;

    constructor() {
        this.fullRegex = /^((<<|>>|>>>|\||\&|\^)?(~?-?([b,x,l,s,u,a-f,0-9]+)))+$/i;
        this.regex = /(<<|>>|>>>|\||\&|\^)?(~?-?(?:[b,x,l,s,u,,a-f,0-9]+))/gi;
    }

    canCreate (input: string) : boolean {
        this.fullRegex.lastIndex = 0;
        return this.fullRegex.test(this.normalizeString(input));
    };

    create (input: string) : Expression {
        var m : RegExpExecArray | null;
        const operands : ExpressionElement[] = [];
        const normalizedString = this.normalizeString(input);

        this.regex.lastIndex = 0;

        while ((m = this.regex.exec(normalizedString)) != null) {
            operands.push(this.parseMatch(m));
        }
                
        return new BitwiseOperation(normalizedString, operands)
    };

    parseMatch (m:RegExpExecArray): ExpressionElement {

        var input = m[0],
            operator = m[1],
            num = m[2];

        var parsed = null;

        if(num.indexOf('~') == 0) {
            parsed = new Operator(parseScalarValue(num.substring(1)), '~');
        }
        else {
            parsed = parseScalarValue(num);
        }

        if(operator == null) {
            return parsed as Operator;
        } else {
            return new Operator(parsed as Operand, operator);
        }
    };

    normalizeString (input : string): string {
        return input.replace(/\s+/g,'');
    };
}

function parseScalarValue(input : string) : Operand {
    const n = numberParser.parse(input);
    var sv = new Operand(n.value, n.base);
    if(sv.value.maxBitSize != n.value.maxBitSize) throw new Error("Gotcha!");
    return sv;
}

var parser = new ExpressionParser();
parser.addFactory(new ListOfNumbersExpressionFactory());
parser.addFactory(new BitwiseOperationExpressionFactory());

export {parser};
