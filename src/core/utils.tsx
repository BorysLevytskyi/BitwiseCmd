import { JsNumber } from "./types";

function chunkifyString(input: string, chunkSize: number) : string[] {
    
    const result : string[] = [];
    for(var i=0;i<input.length;i+=chunkSize) {
        const size = Math.min(chunkSize, input.length-i);
        result.push(input.substr(i, size));
    }

    return result;
}

function asIntN(num: JsNumber) : number {
    return typeof num == "bigint" ? parseInt(num.toString()): num as number;
}

export {chunkifyString, asIntN};