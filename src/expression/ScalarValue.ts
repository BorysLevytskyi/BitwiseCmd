import {numberParser} from './numberParser';
import { ExpressionElement as ExpressionElement } from './expression-interfaces';
import { NumberBase } from '../core/formatter';
import { INT32_MAX_VALUE, INT32_MIN_VALUE, INT64_MAX_VALUE, INT64_MIN_VALUE } from '../core/const';
import { NumberType } from '../core/types';

var globalId : number = 1;


// Represents scalar numeric value
export default class ScalarValue implements ExpressionElement {
    id: number;
    value: NumberType;
    base: NumberBase;
    isOperator: boolean;

    constructor(value : NumberType, base?: NumberBase, is32Limit?: boolean) {
        
        ScalarValue.validateSupported(value);

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
            
    setValue(value : NumberType) {
        this.value = value;
    }

    evaluate() : ScalarValue {
        return this;
    }

    getUnderlyingScalarOperand() : ScalarValue  {
        return this
    }

    static validateSupported(num : NumberType) {
        
        if(typeof num == "bigint" && (num < INT64_MIN_VALUE || num > INT64_MAX_VALUE)) {
            throw new Error(`64-bit numbers are supported in range from ${INT64_MIN_VALUE} to ${INT64_MAX_VALUE}`);
        }

        if(typeof num == "number" && (num < INT32_MIN_VALUE || num > INT32_MAX_VALUE)) {
            throw new Error(`Numer JavaScript type can only by used for numbers in range from ${INT32_MIN_VALUE} to ${INT32_MAX_VALUE}`)
        }
    }

    static parse(input: string) : ScalarValue {
                    
        var parsed = ScalarValue.tryParse(input);

        if(parsed == null) {
            throw new Error(input + " is not a valid number");
        }

        return parsed;
    }

    static tryParse(input: string) : ScalarValue | null {
                    
        var parsed = numberParser.parse(input);

        if(!parsed) {
            return null;
        }

        return new ScalarValue(parsed.value, parsed.base);
    }
}