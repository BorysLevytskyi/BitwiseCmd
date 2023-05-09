import {numberParser} from './numberParser';
import { ExpressionElement as ExpressionElement } from './expression-interfaces';
import { NumberBase } from '../core/formatter';
import { INT32_MAX_VALUE, INT32_MIN_VALUE, INT64_MAX_VALUE, INT64_MIN_VALUE } from '../core/const';
import { Integer, JsNumber, isInteger, asInteger } from '../core/Integer';

var globalId : number = 1;


// Represents scalar numeric value
export default class ScalarValue implements ExpressionElement {
    id: number;
    value: Integer;
    base: NumberBase;
    isOperator: boolean;

    constructor(value : Integer | JsNumber, base?: NumberBase) {
        
         if(!isInteger(value))
             value = asInteger(value);

        ScalarValue.validateSupported(value);

        this.id = globalId++;
        this.value = value as Integer;
        this.base = base || "dec";
        this.isOperator = false;        
    }
  
    setValue(value : Integer) {
        this.value = value;
    }

    evaluate() : ScalarValue {
        return this;
    }

    getUnderlyingScalarOperand() : ScalarValue  {
        return this;
    }

    static validateSupported(num : Integer) {
        
        if((num.value < INT64_MIN_VALUE || num.value > INT64_MAX_VALUE)) {
            throw new Error(`64-bit numbers are supported in range from ${INT64_MIN_VALUE} to ${INT64_MAX_VALUE}. Given number was ${num}`);
        }
    }
}