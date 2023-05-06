import ScalarExpression from './ScalarExpression';
import OperatorExpression from './OperatorExpression'
import ListOfNumbersExpression from './ListOfNumbersExpression';
import BitwiseOperationExpression from './BitwiseOperationExpression';
import { ExpressionInput, Expression } from './expression-interfaces';
import { NumberBase } from '../core/formatter';
import { Match } from '@testing-library/react';

export { default as ScalarExpression } from './ScalarExpression';
export { default as OperatorExpression } from './OperatorExpression';
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
    
    parseOperand (input : string) : ScalarExpression {
        return ScalarExpression.parse(input);
    };

    createOperand (number : number, base : NumberBase) : ScalarExpression {
        return ScalarExpression.create(number, base);
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
            .map(p => ScalarExpression.tryParse(p))
            .filter(n => n == null)
            .length == 0;
    };

    create (input : string) : ExpressionInput {
        
        const numbers = input.split(' ')
            .filter(p => p.length > 0)
            .map(m => ScalarExpression.parse(m));

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
        var m : RegExpExecArray | null;
        const operands : Expression[] = [];
        const normalizedString = this.normalizeString(input);

        this.regex.lastIndex = 0;

        while ((m = this.regex.exec(normalizedString)) != null) {
            operands.push(this.parseMatch(m));
        }
                
        return new BitwiseOperationExpression(normalizedString, operands)
    };

    parseMatch (m:any): Expression {
        var input = m[0],
            operator = m[1],
            num = m[2];

        var parsed = null;
        if(num.indexOf('~') == 0) {
            parsed = new OperatorExpression(ScalarExpression.parse(num.substring(1)), '~');
        }
        else {
            parsed = ScalarExpression.parse(num);
        }

        if(operator == null) {
            return parsed as OperatorExpression;
        } else {
            return new OperatorExpression(parsed as ScalarExpression, operator);
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
