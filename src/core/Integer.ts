import { type } from "os";
import { INT32_MAX_VALUE, INT32_MIN_VALUE, UINT32_MAX_VALUE } from "./const";
import { asIntN, logLines as ln } from "./utils";
import formatter from "./formatter";
import calc from "./calc";

export type JsNumber = number | bigint;
export type IntegerInput = JsNumber | string;

export class Integer {
    
    readonly value: bigint;
    readonly maxBitSize: number;
    readonly signed: boolean;

    constructor(value: IntegerInput, maxBitSize?: number, signed? : boolean) {

        this.value = typeof value == "bigint" ? value : BigInt(value);
        this.signed = signed == null ? true : signed == true;
        this.maxBitSize = maxBitSize != null ? maxBitSize : detectSize(this.value, this.signed);

        if(!this.signed && this.value < 0)
            throw new Error("Value " + value + " cannot be negative if the type is unsigned");
    }

    static unsigned(value : IntegerInput, maxBitSize?: number) {
        return new Integer(value, maxBitSize, false);
    }

    static signed(value : IntegerInput, maxBitSize?: number) {
        return new Integer(value, maxBitSize, true);
    }

    static long(value: IntegerInput) : Integer {
        return new Integer(value, 64);
    }

    static int(value: IntegerInput) : Integer {
        return new Integer(value, 32);
    }

    static short(value: IntegerInput) : Integer {
        return new Integer(value, 16);
    }

    static byte(value: IntegerInput) : Integer {
        return new Integer(value, 8);
    }

    isTheSame  (other : Integer) : boolean {
        return this.value == other.value && this.signed == other.signed && this.maxBitSize == other.maxBitSize;
    }

    toUnsigned() {
        return this.signed 
            ? new Integer(BigInt("0b" + this.toString(2)), this.maxBitSize, false)
            : new Integer(this.value, this.maxBitSize, this.signed);
         
    }

    toSigned() {
        
        if(this.signed)
            return new Integer(this.value, this.maxBitSize, this.signed); 
        
        const orig = this.toString(2).padStart(this.maxBitSize, '0');

        const inverted = orig[0] == '1' ? calc.engine.applyTwosComplement(orig) : orig; 
        const n = BigInt("0b"+inverted);
        const negative = orig[0] == '1';
        
        return new Integer(negative ? -n : n, this.maxBitSize, true)
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
function detectSize(value: bigint, signed: boolean): number {
    
    if(!signed)
        return value > UINT32_MAX_VALUE ? 64 : 32;
    else
        return value < INT32_MIN_VALUE || value > INT32_MAX_VALUE ? 64 : 32;
}

