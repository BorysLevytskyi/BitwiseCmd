import { NumberBase } from "./expression-interfaces";

const decimalRegex = /^-?\d+$/;
const hexRegex = /^-?0x[0-9,a-f]+$/i;
const binRegex = /^-?0b[0-1]+$/i;
const operatorRegex = /^<<|>>|<<<|\&|\|\^|~$/;

interface ParserConfig {
    regex: RegExp,
    radix: number,
    base: NumberBase,
    prefix: string|RegExp
}

export interface ParsedNumber {
    value: number;
    base: NumberBase;
    input: string;
}

var knownParsers : ParserConfig[] = [
    { regex: decimalRegex, radix: 10, base: 'dec', prefix: '^$' },
    { regex: hexRegex, radix: 16, base: 'hex', prefix:/0x/i },
    { regex: binRegex, radix: 2, base: 'bin', prefix:/0b/i }];


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
            
        var value = parseInt(rawInput.replace(parser.prefix, ''), parser.radix);
    
        return  {
            value: value,
            base: parser.base,
            input: rawInput
        }    
    }
}

const numberParser = new NumberParser(knownParsers);

export {numberParser};