import { NumberBase } from "../core/formatter";

const decimalRegex = /^-?\d+n?$/;
const hexRegex = /^-?0x[0-9,a-f]+n?$/i;
const binRegex = /^-?0b[0-1]+n?$/i;

interface ParserConfig {
    regex: RegExp,
    base: NumberBase,
    parse: (input: string) => number | bigint 
}

export interface ParsedNumber {
    value: number|bigint;
    base: NumberBase;
    input: string;
}

var knownParsers : ParserConfig[] = [
    { regex: decimalRegex, base: 'dec', parse:(s) => parseIntSafe(s, 10, '') },
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

const MAX_SAFE_INTn = BigInt(Number.MAX_SAFE_INTEGER);
const MIN_SAFE_INTn = BigInt(Number.MIN_SAFE_INTEGER);

function parseIntSafe(input : string, radix: number)  : number | bigint {
    
    const bigIntStr = input.replace('-', '').replace('n', '');
    let bigInt = BigInt(bigIntStr);
    const isNegative = input.startsWith('-');
    const isBigInt = input.endsWith('n');

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