import { NumberBase } from "../core/formatter";

const decimalBigIntRegex = /^-?\d+n$/;
const decimalRegex = /^-?\d+$/;
const hexRegex = /^-?0x[0-9,a-f]+$/i;
const binRegex = /^-?0b[0-1]+$/i;
const operatorRegex = /^<<|>>|<<<|\&|\|\^|~$/;

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
    { regex: decimalBigIntRegex, base: 'dec', parse: (s) => BigInt(s.substring(0, s.length-1)) },
    { regex: decimalRegex, base: 'dec', parse:(s) => parseInt(s, 10) },
    { regex: hexRegex, base: 'hex', parse:(s) => parseInt(s.replace('0x', ''), 16)},
    { regex: binRegex, base: 'bin', parse:(s) => parseInt(s.replace('0b', ''), 2) }];


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

const numberParser = new NumberParser(knownParsers);

export {numberParser};