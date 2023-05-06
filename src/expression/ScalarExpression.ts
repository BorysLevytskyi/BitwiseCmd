import {numberParser} from './numberParser';
import { Expression as Expression, NumberBase } from './expression-interfaces';

var globalId : number = 1;

const INT_MAX_VALUE = 2147483647;

export {INT_MAX_VALUE};

// Represents scalar numeric value
export default class ScalarExpression implements Expression {
    id: number;
    value: number;
    base: NumberBase;
    lengthInBits: number;
    isOperator: boolean;

    constructor(value : number, base?: NumberBase) {
        
        ScalarExpression.validateValue(value);

        this.id = globalId++;
        this.value = value;
        this.base = base || "dec";
        this.lengthInBits = ScalarExpression.getBitLength(this.value);
        this.isOperator = false;
    }
            
    getLengthInBits() {
        if(this.value < 0) {
            return 32;
        }
        return Math.floor(Math.log(this.value) / Math.log(2)) + 1;
    };

    getOtherBase(kind?: NumberBase) : NumberBase {
        switch(kind || this.base) {
            case 'dec': 
            case 'bin':
                return 'hex';
            case 'hex': return 'dec';
            default : throw new Error(kind + " kind doesn't have opposite kind")
        }
    };

    toString(base?: NumberBase) : string {
        return ScalarExpression.toBaseString(this.value, base || this.base);
    }

    toOtherKindString() : string {
        return this.toString(this.getOtherBase());
    }

    toDecimalString() {
        return this.toString('dec');
    }

    toHexString() {
        return this.toString('hex');
    }

    toBinaryString() : string {
        return this.toString('bin');
    }

    setValue(value : number) {
        ScalarExpression.validateValue(value);
        this.value = value;
        this.lengthInBits = ScalarExpression.getBitLength(value);
    }

    evaluate() : ScalarExpression {
        return this;
    }

    getUnderlyingScalarOperand() : ScalarExpression  {
        return this
    }
        
    static getBitLength(num : number) {
        return Math.floor(Math.log(num) / Math.log(2)) + 1;
    }    
    
    static getBase(kind : string){
        switch (kind){
            case 'bin': return 2;
            case 'hex': return 16;
            case 'dec': return 10;
        }
    };

    static create(value : number, base? : NumberBase) {
        return new ScalarExpression(value, base || "dec");
    };

    static parse(input: string) : ScalarExpression {
                    
        var parsed = ScalarExpression.tryParse(input);

        if(parsed == null) {
            throw new Error(input + " is not a valid number");
        }

        return parsed;
    }

    static tryParse(input: string) : ScalarExpression | null {
                    
        var parsed = numberParser.parse(input);

        if(!parsed) {
            return null;
        }

        return new ScalarExpression(parsed.value, parsed.base);
    }

    static validateValue(value : number) {
        
        if(value < 0 && !ScalarExpression.is32Bit(value))
            throw new Error("BitwiseCmd currently doesn't support 64 bit negative numbers such as " + value);
    }

    static toBaseString(value : number, base : NumberBase) : string {
        
        ScalarExpression.validateValue(value);

        switch(base) {
            case 'hex':
                var hexVal = Math.abs(value).toString(16);
                return value >= 0 ? '0x' + hexVal : '-0x' + hexVal;
            case 'bin':
                // >>> 0 is used to get an actual bit representation of the negative numbers
                // https://stackoverflow.com/questions/5747123/strange-javascript-operator-expr-0
                const is32Bit = ScalarExpression.is32Bit(value);
                return (is32Bit && value < 0 ? (value >>> 0) : value).toString(2);
            case 'dec':
                return value.toString(10);
            default:
                throw new Error("Unexpected kind: " + base)
        }
    };

     static toHexString (hex : string) {
            return hex.indexOf('-') === 0 ? '-0x' + hex.substr(1) : '0x' + hex;
     };

     static is32Bit(n: number) {
        return Math.abs(n) <= INT_MAX_VALUE
     }
}