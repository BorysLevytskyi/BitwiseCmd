import { INT32_MAX_VALUE, INT32_MIN_VALUE } from "../core/const";
import { NumberBase } from "../core/formatter";
import { JsNumber } from "../core/types";

const decimalRegex = /^-?\d+[l,L]?$/;
const hexRegex = /^-?0x[0-9,a-f]+[l,L]?$/i;
const binRegex = /^-?0b[0-1]+[l,L]?$/i;

interface ParserConfig {
    regex: RegExp,
    base: NumberBase,
    parse: (input: string) => JsNumber 
}

export interface ParsedNumber {
    value: JsNumber;
    base: NumberBase;
    input: string;
}

var knownParsers : ParserConfig[] = [
    { regex: decimalRegex, base: 'dec', parse:(s) => parseIntSafe(s, 10) },
    { regex: hexRegex, base: 'hex', parse:(s) => parseIntSafe(s, 16)},
    { regex: binRegex, base: 'bin', parse:(s) => parseIntSafe(s, 2) }];


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

const MAX_SAFE_INTn = BigInt(INT32_MAX_VALUE);
const MIN_SAFE_INTn = BigInt(INT32_MIN_VALUE);

function parseIntSafe(input : string, radix: number)  : JsNumber {
    
const bigIntStr = input.replace('-', '').replace('l', '').replace('L', '');
    let bigInt = BigInt(bigIntStr);
    const isNegative = input.startsWith('-');
    const isBigInt = input.toLowerCase().endsWith('l');

    if(isNegative) bigInt *= BigInt(-1);

    if(isBigInt) return bigInt;

    if(bigInt > MAX_SAFE_INTn)
        return bigInt;

    if(bigInt < MIN_SAFE_INTn)
        return bigInt;

    return parseInt(input.replace(/0(x|b)/, ''), radix);
}

const numberParser = new NumberParser(knownParsers);

export {numberParser};