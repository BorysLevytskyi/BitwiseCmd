import { type } from "os";
import { INT32_MAX_VALUE, INT32_MIN_VALUE } from "./const";
import { asIntN } from "./utils";

export type JsNumber = number | bigint;


export class BoundedInt {
    value: bigint;
    maxBitSize: number;
    constructor(value: bigint | number, maxBitSize?: number) {
        this.value = typeof value == "bigint" ? value : BigInt(value);
        this.maxBitSize = maxBitSize != null ? maxBitSize : (value >= INT32_MIN_VALUE && value <= INT32_MAX_VALUE) ? 32 : 64;
    }

    valueOf() {
        return this.value.toString();
    }

    toString() {
        return this.value.toString();
    }
    
    num() {
        return asIntN(this.value);
    }

    bigint() {
        return this.value;
    }
}

export function asBoundedNumber(num: JsNumber | BoundedInt | string): BoundedInt {

    if(typeof num == "string")
        return asBoundedNumber(BigInt(num));

    if(isBoundedNumber(num)) 
        return num;

    if(typeof num == "number" && isNaN(num)) {
        throw new Error("Cannot create BoundedNumber from NaN");
    }

    const size = num > INT32_MAX_VALUE || num < INT32_MIN_VALUE ? 64 : 32;
    
    const n = typeof num == "bigint" ? num : BigInt(num);
    return new BoundedInt(n, size);
}

export function isBoundedNumber(num: JsNumber | BoundedInt): num is BoundedInt {
    return (<BoundedInt>num).maxBitSize !== undefined;
 }