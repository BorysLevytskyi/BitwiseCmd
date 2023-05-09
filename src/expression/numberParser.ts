import { INT32_MAX_VALUE, INT32_MIN_VALUE } from "../core/const";
import { NumberBase } from "../core/formatter";
import { BoundedInt, asBoundedNumber } from "../core/types";

// byte -i8 or b
// single - i16 or s 

const decimalRegex = /^-?\d+[l,L]?$/;
const hexRegex = /^-?0x[0-9,a-f]+[l,L]?$/i;
const binRegex = /^-?0b[0-1]+[l,L]?$/i;

interface ParserConfig {
    regex: RegExp,
    base: NumberBase,
    parse: (input: string) => BoundedInt 
}

export interface ParsedNumber {
    value: BoundedInt;
    base: NumberBase;
    input: string;
}

var knownParsers : ParserConfig[] = [
    { regex: decimalRegex, base: 'dec', parse:(s) => parseBoundedInt(s, 10) },
    { regex: hexRegex, base: 'hex', parse:(s) => parseBoundedInt(s, 16)},
    { regex: binRegex, base: 'bin', parse:(s) => parseBoundedInt(s, 2) }];


class NumberParser {

    parsers: ParserConfig[];

    constructor(parsers: ParserConfig[])
    {
        this.parsers = parsers;
    }

    parse (input : string) : ParsedNumber | null {
        return this.parsers.map(p => this.applyParser(p, input)).reduce((c, n) => c || n);
    };

    parseOperator (input: string) : string | null {
        var m = input.match(input);
        
        if(m == null || m.length == 0) {
            return null;
        }

        return m[0];
    };

    applyParser(parser : ParserConfig, rawInput: string) : ParsedNumber | null {
    
        if(!parser.regex.test(rawInput)) {
            return null;
        }
            
        var value = parser.parse(rawInput);
    
        return  {
            value: value,
            base: parser.base,
            input: rawInput
        }    
    }
}

function parseBoundedInt(input : string, radix: number)  : BoundedInt {
    
    const lower = input.toLocaleLowerCase();
    const bigIntStr = lower.replace('-', '').replace('l', '');
    let n = BigInt(bigIntStr);
    const size = lower.endsWith('l') || n > INT32_MAX_VALUE ? 64 : 32;
    const isNegative = input.startsWith('-');

    if(isNegative) n = -n;

    return new BoundedInt(n, size);
}

const numberParser = new NumberParser(knownParsers);

export {numberParser};