import {numberParser} from './numberParser';
import { Expression as Expression, NumberBase } from './expression-interfaces';
import formatter from '../core/formatter';
import { INT_MAX_VALUE } from '../core/const';

var globalId : number = 1;


// Represents scalar numeric value
export default class ScalarExpression implements Expression {
    id: number;
    value: number;
    base: NumberBase;
    isOperator: boolean;

    constructor(value : number, base?: NumberBase) {
        
        this.id = globalId++;
        this.value = value;
        this.base = base || "dec";
        this.isOperator = false;
    }
            
    

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
        this.value = value;
    }

    evaluate() : ScalarExpression {
        return this;
    }

    getUnderlyingScalarOperand() : ScalarExpression  {
        return this
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

    static toBaseString(value : number, base : NumberBase) : string {
        
        switch(base) {
            case 'hex':
                var hexVal = Math.abs(value).toString(16);
                return value >= 0 ? '0x' + hexVal : '-0x' + hexVal;
            case 'bin':
                return formatter.bin(value);
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