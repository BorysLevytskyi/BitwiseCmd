import { type } from "os";

export type JsNumber = number | bigint;
export type BoundedNumber = {
    value: JsNumber,
    maxBitSize: number
}

export function asBoundedNumber(num: JsNumber | BoundedNumber): BoundedNumber {

    if(isBoundedNumber(num)) 
        return num;

    if(typeof num == "number" && isNaN(num)) {
        throw new Error("Cannot create BoundedNumber from NaN");
    }
    
    return {value:num, maxBitSize: maxBitSize(num)};
}

export function isBoundedNumber(num: JsNumber | BoundedNumber): num is BoundedNumber {
    return (<BoundedNumber>num).maxBitSize !== undefined;
 }

export function maxBitSize(num : JsNumber) : number {
    return typeof num == "bigint" ? 64 : 32;
};