import { type } from "os";
import { INT32_MAX_VALUE, INT32_MIN_VALUE } from "./const";

export type JsNumber = number | bigint;


export class BoundedNumber {
    value: bigint;
    maxBitSize: number;
    constructor(value: bigint | number, maxBitSize?: number) {
        this.value = typeof value == "bigint" ? value : BigInt(value);
        this.maxBitSize = maxBitSize || (value >= INT32_MIN_VALUE && value <= INT32_MAX_VALUE) ? 32 : 64;
    }

    valueOf() {
        return this.value.toString();
    }
}

export function asBoundedNumber(num: JsNumber | BoundedNumber): BoundedNumber {

    if(isBoundedNumber(num)) 
        return num;

    if(typeof num == "number" && isNaN(num)) {
        throw new Error("Cannot create BoundedNumber from NaN");
    }

    const size = num > INT32_MAX_VALUE || num < INT32_MIN_VALUE ? 64 : 32;
    
    const n = typeof num == "bigint" ? num : BigInt(num);
    return new BoundedNumber(n, size);
}

export function isBoundedNumber(num: JsNumber | BoundedNumber): num is BoundedNumber {
    return (<BoundedNumber>num).maxBitSize !== undefined;
 }