import { type } from "os";
import { INT32_MAX_VALUE, INT32_MIN_VALUE } from "./const";

export type JsNumber = number | bigint;
export type BoundedNumber = {
    value: bigint,
    maxBitSize: number
}

export function asBoundedNumber(num: JsNumber | BoundedNumber): BoundedNumber {

    if(isBoundedNumber(num)) 
        return num;

    if(typeof num == "number" && isNaN(num)) {
        throw new Error("Cannot create BoundedNumber from NaN");
    }

    const size = num > INT32_MAX_VALUE || num < INT32_MIN_VALUE ? 64 : 32;
    
    const n = typeof num == "bigint" ? num : BigInt(num);
    return {value:n, maxBitSize: size};
}

export function isBoundedNumber(num: JsNumber | BoundedNumber): num is BoundedNumber {
    return (<BoundedNumber>num).maxBitSize !== undefined;
 }