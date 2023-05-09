import { prefix } from "@fortawesome/free-solid-svg-icons";
import { INT32_MAX_VALUE, INT32_MIN_VALUE } from "../core/const";
import { NumberBase } from "../core/formatter";
import { Integer, asInteger } from "../core/types";

// byte -i8 or b
// single - i16 or s 

const decimalRegex = /^-?\d+[l,L,s,S,b,B]?$/;
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
    { regex: decimalRegex, base: 'dec', parse:(s) => parseBoundedInt(s,) },
    { regex: hexRegex, base: 'hex', parse:(s) => parseBoundedInt(s)},
    { regex: binRegex, base: 'bin', parse:(s) => parseBoundedInt(s) }];


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

function parseBoundedInt(input : string)  : Integer {
    
    const lower = input.toLocaleLowerCase().trim();
    const suffix = getSuffix(lower);
    const bigIntStr = lower.replace('-', '').replace(suffix, '');
    let n = BigInt(bigIntStr);
    
    const size = getSizeBySuffix(suffix, n);
    const isNegative = input.startsWith('-');

    if(isNegative) n = -n;

    return new Integer(n, size);
}

function getSuffix(lower: string) {
    if(lower.startsWith('0x') || lower.startsWith('0b'))
        return '';
    
    const match = /[l,s,b]$/.exec(lower);
    
    if(match == null || match.length == 0)
        return '';
    
    return match[0];
}

function getSizeBySuffix(suffix: string, value : bigint) {
 
        switch(suffix.toLowerCase()) {
        case 'l': return 64;
        case 's': return 16;
        case 'b': return 8;
        default: return value > INT32_MAX_VALUE  ? 64 : 32;
    }
}

const numberParser = new NumberParser(knownParsers);

export {numberParser};