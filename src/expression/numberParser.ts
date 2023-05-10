import { INT32_MAX_VALUE, UINT32_MAX_VALUE } from "../core/const";
import { NumberBase } from "../core/formatter";
import { Integer } from "../core/Integer";

const numberRegexString = "-?([0-9]+|0b[0-1]+|0x[0-9,a-f]+)(l|s|b|ul|us|ub|u)?";
const numberRegexFullString = "^"+numberRegexString+"$"

export interface ParsedNumber {
    value: Integer;
    base: NumberBase;
    input: string;
}

class NumberParser {
    
    numberRegexString: string;

    constructor()
    {
        this.numberRegexString = numberRegexString;
    }

    caseParse(input : string) {
        const regex = new RegExp(numberRegexFullString);
        return regex.test(input);
    }

    parse (input : string) : ParsedNumber {

        if(input.length == 0) throw new Error("input is null or empty");

        const regex = new RegExp(numberRegexFullString, "i");
        
        const m = regex.exec(input);

        if(m == null || m.length == 0)
            throw new Error(input + " is not a number");

        const value = parseInteger(m[0], m[1], m[2] || '');
        
        return {
            value: value,
            base: getBase(input),
            input: input
        }
    };
}

function parseInteger(input : string, numberPart: string, suffix: string)  : Integer {
    
    const isNegative = input.startsWith('-');
    let num = BigInt(numberPart);
    const signed = !suffix.startsWith('u');

    if(!signed && isNegative)
        throw new Error(input + " unsigned integer cannot be negative");

    const size = getSizeBySuffix(suffix, num, signed);
    return new Integer(isNegative  ? -num : num, size, signed);
}

function getSizeBySuffix(suffix: string, value : bigint, signed: boolean) {
    
    const max32 = signed ? INT32_MAX_VALUE : UINT32_MAX_VALUE;
    
    switch(suffix.replace('u', '').toLowerCase()) {
        case 'l': return 64;
        case 's': return 16;
        case 'b': return 8;
        default: return value > max32  ? 64 : 32;
    }
}

function getBase(input: string): NumberBase {

    if(input.indexOf('0b') > -1) return 'bin';
    if(input.indexOf('0x') > -1) return 'hex';
    return 'dec';
}

const numberParser = new NumberParser();

export {numberParser, numberRegexString};
