import {numberParser} from './numberParser';
import { ExpressionInputItem, NumberBase } from './expression-interfaces';

var globalId : number = 1;

// Represents numeric value
export default class NumericOperand implements ExpressionInputItem {
    id: number;
    value: number;
    base: NumberBase;
    lengthInBits: number;
    isExpression: boolean;

    constructor(value : number, base?: NumberBase) {
        this.id = globalId++;
        this.value = value;
        this.base = base || "dec";
        this.lengthInBits = NumericOperand.getBitLength(this.value);
        this.isExpression = false;
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
        return NumericOperand.toBaseString(this.value, base || this.base);
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
        this.value = value;
        this.lengthInBits = NumericOperand.getBitLength(value);
    }

    evaluate() : NumericOperand {
        return this;
    }

    getUnderlyingOperand() : NumericOperand  {
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
        return new NumericOperand(value, base || "dec");
    };

    static parse(input: string) : NumericOperand {
                    
        var parsed = numberParser.parse(input);

        if(!parsed) {
            throw new Error(input + " is not a valid number");
        }

        return new NumericOperand(parsed.value, parsed.base);
    }

    static toBaseString(value : number, base : NumberBase) : string {
        switch(base) {
            case 'hex':
                var hexVal = Math.abs(value).toString(16);
                return value >= 0 ? '0x' + hexVal : '-0x' + hexVal;
            case 'bin':
                return (value>>>0).toString(2);
            case 'dec':
                return value.toString(10);
            default:
                throw new Error("Unexpected kind: " + base)
        }
    };

     static toHexString (hex : string) {
            return hex.indexOf('-') === 0 ? '-0x' + hex.substr(1) : '0x' + hex;
     };
}