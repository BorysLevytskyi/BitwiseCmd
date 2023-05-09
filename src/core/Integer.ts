import { type } from "os";
import { INT32_MAX_VALUE, INT32_MIN_VALUE } from "./const";
import { asIntN } from "./utils";
import formatter from "./formatter";

export type JsNumber = number | bigint;


export class Integer {
    value: bigint;
    maxBitSize: number;
    signed: boolean;

    constructor(value: JsNumber, maxBitSize?: number, signed? : boolean) {
        this.value = typeof value == "bigint" ? value : BigInt(value);
        this.maxBitSize = maxBitSize != null ? maxBitSize : (value >= INT32_MIN_VALUE && value <= INT32_MAX_VALUE) ? 32 : 64;
        this.signed = signed == null ? true : signed;
    }

    static unsigned(value : JsNumber, maxBitSize?: number) {
        return new Integer(value, maxBitSize, false);
    }

    valueOf() {
        return this.value.toString();
    }

    toString(base?:number) {
        return formatter.numberToString(this, base || 10);
    }
    
    num() {
        return asIntN(this.value);
    }

    bigint() {
        return this.value;
    }
}

export function asInteger(num: JsNumber | Integer | string): Integer {

    if(typeof num == "string")
        return asInteger(BigInt(num));

    if(isInteger(num)) 
        return num;

    if(typeof num == "number" && isNaN(num)) {
        throw new Error("Cannot create BoundedNumber from NaN");
    }

    const size = num > INT32_MAX_VALUE || num < INT32_MIN_VALUE ? 64 : 32;
    
    const n = typeof num == "bigint" ? num : BigInt(num);
    return new Integer(n, size);
}

export function isInteger(num: JsNumber | Integer): num is Integer {
    return (<Integer>num).maxBitSize !== undefined;
 }