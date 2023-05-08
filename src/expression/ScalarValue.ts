import {numberParser} from './numberParser';
import { ExpressionElement as ExpressionElement } from './expression-interfaces';
import { NumberBase } from '../core/formatter';
import { INT32_MAX_VALUE, INT32_MIN_VALUE, INT64_MAX_VALUE, INT64_MIN_VALUE } from '../core/const';
import { BoundedInt, JsNumber, isBoundedNumber, asBoundedNumber } from '../core/types';
import calc from '../core/calc';

var globalId : number = 1;


// Represents scalar numeric value
export default class ScalarValue implements ExpressionElement {
    id: number;
    value: BoundedInt;
    base: NumberBase;
    isOperator: boolean;

    constructor(value : BoundedInt | JsNumber, base?: NumberBase) {

        if(!isBoundedNumber(value))
            value = asBoundedNumber(value);

        ScalarValue.validateSupported(value);

        this.id = globalId++;
        this.value = new BoundedInt(0);
        this.base = base || "dec";
        this.isOperator = false;
        
        this.setValue(value);
    }
  
    setValue(value : BoundedInt) {
        this.value = value;
    }

    evaluate() : ScalarValue {
        return this;
    }

    getUnderlyingScalarOperand() : ScalarValue  {
        return this
    }

    static validateSupported(num : BoundedInt) {
        
        if(typeof num.value == "bigint" && (num.value < INT64_MIN_VALUE || num.value > INT64_MAX_VALUE)) {
            throw new Error(`64-bit numbers are supported in range from ${INT64_MIN_VALUE} to ${INT64_MAX_VALUE}. Given number was ${num}`);
        }

        if(typeof num.value == "number" && (num.value < INT32_MIN_VALUE || num.value > INT32_MAX_VALUE)) {
            throw new Error(`Numer JavaScript type can only by used for numbers in range from ${INT32_MIN_VALUE} to ${INT32_MAX_VALUE}. Given number was ${num.value}`)
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