import {numberParser} from './numberParser';
import { ExpressionToken as ExpressionToken } from './expression-interfaces';
import { NumberBase } from '../core/formatter';

var globalId : number = 1;


// Represents scalar numeric value
export default class ScalarToken implements ExpressionToken {
    id: number;
    value: number | bigint;
    base: NumberBase;
    isOperator: boolean;

    constructor(value : number | bigint, base?: NumberBase, is32Limit?: boolean) {
        
        this.id = globalId++;
        this.value = value;
        this.base = base || "dec";
        this.isOperator = false;
    }

    bitSize() : number {
        return this.isBigInt() ? 64 : 32;
    }

    isBigInt() : boolean {
        return typeof this.value === 'bigint';
    }
            
    setValue(value : number | bigint) {
        this.value = value;
    }

    evaluate() : ScalarToken {
        return this;
    }

    getUnderlyingScalarOperand() : ScalarToken  {
        return this
    }

    static parse(input: string) : ScalarToken {
                    
        var parsed = ScalarToken.tryParse(input);

        if(parsed == null) {
            throw new Error(input + " is not a valid number");
        }

        return parsed;
    }

    static tryParse(input: string) : ScalarToken | null {
                    
        var parsed = numberParser.parse(input);

        if(!parsed) {
            return null;
        }

        return new ScalarToken(parsed.value, parsed.base);
    }
}