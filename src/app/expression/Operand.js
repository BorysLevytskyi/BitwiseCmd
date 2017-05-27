import numberParser from './numberParser';
import ExpressionError from './ExpressionError';

// Represents numeric value
export default class Operand {
        constructor(cfg) {

            this.input = cfg.input;
            this.value = cfg.value;
            this.kind = cfg.kind;

            this.hex = Operand.toHexString(this.value.toString(16));
            this.dec = this.value.toString(10);
            // >>> 0 makes negative numbers like -1 to be displayed as '11111111111111111111111111111111' in binary instead of -1
            this.bin = this.value < 0 ? (this.value >>> 0).toString(2) : this.value.toString(2);
            this.other = this.kind == 'hex' ? this.dec : this.hex;

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
                case 'dec': return 'hex';
                case 'hex': return 'dec';
                default : throw new Error(kind + " kind doesn't have opposite kind")
            }
    };

    toString() {
        return this.input;
    }

    setValue(value) {
        this.value = value;
        this.bin = Operand.toKindString(this.value, 'bin');
        this.dec = Operand.toKindString(this.value, 'dec');
        this.hex = Operand.toKindString(this.value, 'hex');
        this.other = Operand.toKindString(this.value, this.getOtherKind());
        this.input = Operand.toKindString(this.value, this.kind);
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