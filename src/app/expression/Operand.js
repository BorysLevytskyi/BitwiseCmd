import numberParser from './numberParser';
import ExpressionError from './ExpressionError';

// Represents numeric value
export default class Operand {
        constructor(cfg) {
            this.value = cfg.value;
            this.kind = cfg.kind;
            this.lengthInBits = Operand.getBitLength(this.value);
        }
                
        getLengthInBits() {
            if(this.value < 0) {
                return 32;
            }
            return Math.floor(Math.log(this.value) / Math.log(2)) + 1;
        };

        getOtherKind(kind) {
            switch(kind || this.kind) {
                case 'dec': 
                case 'bin':
                    return 'hex';
                case 'hex': return 'dec';
                default : throw new Error(kind + " kind doesn't have opposite kind")
            }
    };

    toString(kind) {
        return Operand.toKindString(this.value, kind || this.kind);
    }

    toOtherKindString() {
        return this.toString(this.getOtherKind());
    }

    toDecimalString() {
        return this.toString('dec');
    }

    toHexString() {
        return this.toString('hex');
    }

    toBinaryString() {
        return this.toString('bin');
    }

    setValue(value) {
        this.value = value;
    }
        
    static getBitLength(num) {
        return Math.floor(Math.log(num) / Math.log(2)) + 1
    }    
    
    static getBase(kind){
        switch (kind){
            case 'bin': return 2;
            case 'hex': return 16;
            case 'dec': return 10;
        }
    };

    static create(value, kind) {

        return new Operand({
            value: value,
            kind: kind,
            input: Operand.toKindString(value, kind),
        });
    };

    static parse(input) {
                    
            var parsed = numberParser.parse(input);

            if(!parsed) {
                throw new ExpressionError(input + " is not a valid number");
            }

            return new Operand(parsed);
    }

    static toKindString(value, kind) {
            switch(kind) {
                case 'hex':
                    var hexVal = Math.abs(value).toString(16);
                    return value >= 0 ? '0x' + hexVal : '-0x' + hexVal;
                case 'bin':
                    return (value>>>0).toString(2);
                case 'dec':
                    return value.toString(10);
                default:
                    throw new Error("Unexpected kind: " + kind)
            }
        };

     static toHexString (hex) {
            return hex.indexOf('-') == 0 ? '-0x' + hex.substr(1) : '0x' + hex;
     };
}