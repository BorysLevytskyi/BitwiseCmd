import {numberParser} from './numberParser';
import { ExpressionToken as ExpressionToken } from './expression-interfaces';
import { NumberBase } from '../core/formatter';
import { INT32_MAX_VALUE, INT32_MIN_VALUE, INT64_MAX_VALUE, INT64_MIN_VALUE } from '../core/const';

var globalId : number = 1;


// Represents scalar numeric value
export default class ScalarToken implements ExpressionToken {
    id: number;
    value: number | bigint;
    base: NumberBase;
    isOperator: boolean;

    constructor(value : number | bigint, base?: NumberBase, is32Limit?: boolean) {
        
        ScalarToken.validateSupported(value);

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

    static validateSupported(num : number | bigint) {
        
        if(typeof num == "bigint" && (num < INT64_MIN_VALUE || num > INT64_MAX_VALUE)) {
            throw new Error(`64-bit numbers are supported in range from ${INT64_MIN_VALUE} to ${INT64_MAX_VALUE}`);
        }

        if(typeof num == "number" && (num < INT32_MIN_VALUE || num > INT32_MAX_VALUE)) {
            throw new Error(`Numer JavaScript type can only by used for numbers in range from ${INT32_MIN_VALUE} to ${INT32_MAX_VALUE}`)
        }
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