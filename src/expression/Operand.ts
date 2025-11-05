import { ExpressionElement } from './expression-interfaces';
import { NumberBase } from '../core/formatter';
import { INT64_MAX_VALUE, INT64_MIN_VALUE, UINT64_MAX_VALUE } from '../core/const';
import { Integer, JsNumber, isInteger, asInteger } from '../core/Integer';

var globalId : number = 1;


// Represents scalar numeric value
export default class Operand implements ExpressionElement {
    id: number;
    value: Integer;
    base: NumberBase;
    isOperator: boolean;
    label: string;

    constructor(value : Integer | JsNumber, base?: NumberBase) {
        
         if(!isInteger(value))
             value = asInteger(value);

        Operand.validateSupported(value);

        this.id = globalId++;
        this.value = value as Integer;
        this.base = base || "dec";
        this.isOperator = false; 
        this.label = '';       
    }
  
    setValue(value : Integer) : Operand {
        this.value = value;
        return this;
    }

    setLabel(label : string) : Operand {
        this.label = label;
        return this;
    }

    evaluate() : Operand {
        return this;
    }

    getUnderlyingOperand() : Operand  {
        return this;
    }

    static validateSupported(num : Integer) {
        
        if(num.signed && (num.value < INT64_MIN_VALUE || num.value > INT64_MAX_VALUE)) {
            throw new Error(`Signed 64-bit numbers are supported in range from ${INT64_MIN_VALUE} to ${INT64_MAX_VALUE}. Given number was ${num}`);
        }

        if(!num.signed && (num.value > UINT64_MAX_VALUE)) {
            throw new Error(`Unisgned 64-bit numbers larger than ${UINT64_MAX_VALUE} are not supported. Given number was ${num}`);
        }
    }
}