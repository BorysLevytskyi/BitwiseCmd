import formatter from "./formatter";
import { BoundedInt, JsNumber,  asBoundedNumber } from "./types";
import { asIntN } from "./utils";

export default {
    abs (num : BoundedInt) : BoundedInt {
        return asBoundedNumber(num.value >= 0 ? num.value : -num.value);
    },
    
    numberOfBitsDisplayed: function (num: BoundedInt | JsNumber) : number {
        return this.toBinaryString(asBoundedNumber(num)).length;
    },

    flipBit: function(num: BoundedInt | JsNumber, bitIndex: number): BoundedInt  {
        return this._applySingle(asBoundedNumber(num), (bin) => this.bitwise.flipBit(bin, bitIndex));
    },

    promoteTo64Bit(number: BoundedInt) : BoundedInt {
        const bin = this.toBinaryString(number);
        return new BoundedInt(BigInt("0b" + bin), 64);
    },

    

    toBinaryString(num: BoundedInt) : string {
        const bitSize = num.maxBitSize;
        const bin = this.abs(num).value.toString(2);
        
        if(bin.length > bitSize!)
            throw new Error(`Binary represenation '${bin}' is bigger than the given bit size ${bitSize}`)

        const r = num.value < 0
            ? this.bitwise.applyTwosComplement(bin.padStart(bitSize, '0'))
            : bin;

        return r;
    },

    lshift (num: BoundedInt, numBytes : JsNumber) : BoundedInt {
        return this._applySingle(num, bin => this.bitwise.lshift(bin, asIntN(numBytes)));
    },

    rshift (num : BoundedInt, numBytes : JsNumber) : BoundedInt {
        return this._applySingle(num, bin => this.bitwise.rshift(bin, asIntN(numBytes)));
    },

    urshift (num : BoundedInt, numBytes : JsNumber) : BoundedInt {
        return this._applySingle(num, bin => this.bitwise.urshift(bin, asIntN(numBytes)));
    },

    not(num:BoundedInt) : BoundedInt { 
        return this._applySingle(num, this.bitwise.not);
    },

    and (num1 : BoundedInt, num2 : BoundedInt) : BoundedInt {
        return this._applyTwo(num1, num2, this.bitwise.and);
    },

    or (num1 : BoundedInt, num2 : BoundedInt) : BoundedInt {
        return this._applyTwo(num1, num2, this.bitwise.or);
    },

    xor (num1 : BoundedInt, num2 : BoundedInt) : BoundedInt {
        return this._applyTwo(num1, num2, this.bitwise.xor);
    },

    _applySingle(num: BoundedInt, operation: (bin:string) => string) : BoundedInt {

        let bin = this.toBinaryString(num).padStart(num.maxBitSize, '0');

        bin = operation(bin);

        let m = BigInt(1);

        if(bin['0'] == '1') {
            bin = this.bitwise.applyTwosComplement(bin);
            m = BigInt(-1);
        }

        const result = BigInt("0b" + bin) * m;
        return asBoundedNumber(typeof num.value == "bigint" ? result : asIntN(result));
    },

    _applyTwo(num1: BoundedInt, num2: BoundedInt,  operation: (bin1:string, bin2:string) => string) : BoundedInt {

        let bin1 = this.toBinaryString(num1).padStart(num1.maxBitSize, '0');
        let bin2 = this.toBinaryString(num2).padStart(num2.maxBitSize, '0');

        let resultBin = operation(bin1, bin2);

        let m = BigInt(1);
    
        if(resultBin['0'] == '1') {
            resultBin = this.bitwise.applyTwosComplement(resultBin);
            m = BigInt(-1);
        }

        const result = BigInt("0b" + resultBin) * m;
        const isBigInt = typeof num1.value == "bigint" || typeof num2.value == "bigint";
        return asBoundedNumber( isBigInt ? result : asIntN(result));
    },

    bitwise: { 
        lshift (bin: string, bytes: number):string {
            return bin.substring(bytes) + "0".repeat(bytes);
        },
        rshift (bin: string, bytes: number):string {
            const pad = bin[0].repeat(bytes);
            return pad + bin.substring(0, bin.length - bytes);
        },
        urshift (bin: string, bytes: number):string {
            const pad = '0'.repeat(bytes);
            return pad + bin.substring(0, bin.length - bytes);
        },
        not (bin: string) : string {

            return bin
                .split('').map(c => flip(c))
                .join("");
        },
        or (bin1: string, bin2 : string) : string  {

            checkSameLength(bin1, bin2);

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 || b2 ? "1" : "0");
            }

            return result.join('');
        },
        and (bin1: string, bin2 : string) : string  {

            checkSameLength(bin1, bin2);

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 && b2 ? "1" : "0");
            }

            return result.join('');
        },
        xor (bin1: string, bin2:string) : string {

            checkSameLength(bin1, bin2);

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 != b2 ? "1" : "0");
            }

            return result.join('');
        },
        flipBit(bin: string, bitIndex : number) : string {
            return bin.substring(0, bitIndex) + flip(bin[bitIndex]) + bin.substring(bitIndex+1)
        },
        applyTwosComplement: (bin:string):string => {
            var lastIndex = bin.lastIndexOf('1');
        
            // If there exists no '1' concat 1 at the
            // starting of string
            if (lastIndex == -1)
                return "1" + bin;
        
            // Continue traversal backward after the position of
            // first '1'
            var flipped =[];
            for (var i = lastIndex - 1; i >= 0; i--) {
                // Just flip the values
                flipped.unshift(bin.charAt(i) == "1" ? "0" : "1");
            }
        
            return flipped.join('') + bin.substring(lastIndex) ;
        },
    }
};

function checkSameLength(bin1: string, bin2: string) {
    if (bin1.length != bin2.length)
        throw new Error("Binary strings must have the same length");
}

function flip(bit:string):string { 
    return bit === "0" ? "1" : "0";
}