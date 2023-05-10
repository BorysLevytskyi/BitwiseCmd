import { type } from "os";
import { INT32_MAX_VALUE, INT32_MIN_VALUE } from "./const";
import { asIntN } from "./utils";
import formatter from "./formatter";
import calc from "./calc";

export type JsNumber = number | bigint;


export class Integer {
    
    readonly value: bigint;
    readonly maxBitSize: number;
    readonly signed: boolean;

    constructor(value: JsNumber, maxBitSize?: number, signed? : boolean) {
        this.value = typeof value == "bigint" ? value : BigInt(value);
        this.maxBitSize = maxBitSize != null ? maxBitSize : (value >= INT32_MIN_VALUE && value <= INT32_MAX_VALUE) ? 32 : 64;
        this.signed = signed == null ? true : signed == true;
    }

    static unsigned(value : JsNumber, maxBitSize?: number) {
        return new Integer(value, maxBitSize, false);
    }

    static long(value: JsNumber) : Integer {
        return new Integer(value, 64);
    }

    static int(value: JsNumber) : Integer {
        return new Integer(value, 32);
    }

    static short(value: JsNumber) : Integer {
        return new Integer(value, 16);
    }

    static byte(value: JsNumber) : Integer {
        return new Integer(value, 8);
    }

    toUnsigned() {
        return this.signed 
            ? new Integer(BigInt("0b" + this.toString(2)), this.maxBitSize, false)
            : new Integer(this.value, this.maxBitSize, this.signed);
         
    }

    toSigned() {
        
        if(this.signed)
            return new Integer(this.value, this.maxBitSize, this.signed); 
        
        const bin = calc.engine.applyTwosComplement(this.toString(2)); 
        const n = BigInt("0b"+bin);
        
        return new Integer(bin[0] == '1' ? n : -n, this.maxBitSize, true)
    }

    resize(newSize: number) {

        if(newSize < this.maxBitSize)
            throw new Error("Size cannot be reduced");
        
        if(newSize > 64)
            throw new Error(`Bit size of ${newSize} is not supported`)
            
        return new Integer(this.value, newSize, this.signed);
    }

    convertTo(other: Integer) {
        
        let newValue = this.value;

        if(this.signed && !other.signed)
            newValue = this.toUnsigned().value;

        return new Integer(newValue, other.maxBitSize, other.signed);
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