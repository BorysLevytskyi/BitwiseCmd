import { prefix } from "@fortawesome/free-solid-svg-icons";
import { INT32_MAX_VALUE, INT32_MIN_VALUE, UINT32_MAX_VALUE } from "../core/const";
import { NumberBase } from "../core/formatter";
import { Integer, asInteger } from "../core/Integer";

// byte -i8 or b
// single - i16 or s 

const decimalRegex = /^-?\d+(l|s|b|ul|us|ub|u)?$/;
const hexRegex = /^-?0x[0-9,a-f]+$/i;
const binRegex = /^-?0b[0-1]+$/i;

interface ParserConfig {
    regex: RegExp,
    base: NumberBase,
    parse: (input: string) => Integer 
}

export interface ParsedNumber {
    value: Integer;
    base: NumberBase;
    input: string;
}

var knownParsers : ParserConfig[] = [
    { regex: decimalRegex, base: 'dec', parse:(s) => parseInteger(s,) },
    { regex: hexRegex, base: 'hex', parse:(s) => parseInteger(s)},
    { regex: binRegex, base: 'bin', parse:(s) => parseInteger(s) }];


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
    
        if(!parser.regex.test(rawInput.toLowerCase())) {
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

function parseInteger(input : string)  : Integer {
    
    const lower = input.toLocaleLowerCase().trim();
    const isNegative = input.startsWith('-');
    let suffix = getSuffix(lower);
    
    const bigIntStr = lower.replace('-', '').replace(suffix, '');
    let num = BigInt(bigIntStr);
    
    const signed = !suffix.startsWith('u');

    if(!signed)
    {
        if(isNegative)
            throw new Error(input + ": unsigned integer cannot be negative"); 

        suffix = suffix.substring(1);
    }

    const size = getSizeBySuffix(suffix, num, signed);

    return new Integer(isNegative  ? -num : num, size, signed);
}

function getSuffix(lower: string) {
    
    if(lower.startsWith('0x') || lower.startsWith('0b'))
        return '';
    
    const match = /[l,s,b,u]+$/.exec(lower);
    
    if(match == null || match.length == 0)
        return '';
    
    return match[0];
}

function getSizeBySuffix(suffix: string, value : bigint, signed: boolean) {
    const max32 = signed ? INT32_MAX_VALUE : UINT32_MAX_VALUE;
    switch(suffix.toLowerCase()) {
        case 'l': return 64;
        case 's': return 16;
        case 'b': return 8;
        default: return value > max32  ? 64 : 32;
    }
}

const numberParser = new NumberParser(knownParsers);

export {numberParser};