import formatter from "./formatter";
import { BoundedNumber, JsNumber, maxBitSize, asBoundedNumber } from "./types";
import { asIntN } from "./utils";

export default {
    abs (num : BoundedNumber) : BoundedNumber {
        return asBoundedNumber(num.value >= 0 ? num.value : -num.value);
    },
    
    maxBitSize(num : JsNumber) : number {
        return maxBitSize(num);
    },

    numberOfBitsDisplayed: function (num: JsNumber) : number {
        
        if(num < 0) {
            return typeof num == 'bigint' ? 64 : 32
        };

        return num.toString(2).length;
    },

    flipBit: function(num: BoundedNumber | JsNumber, bitIndex: number): BoundedNumber  {
        return this._apply(asBoundedNumber(num), (bin) => this.bitwise.flipBit(bin, bitIndex));
    },

    promoteTo64Bit(number: number) : BoundedNumber {
        const bin = this.toBinaryString(asBoundedNumber(number));
        return asBoundedNumber(BigInt("0b" + bin));
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

    toBinaryString(num: BoundedNumber) : string {

        const bitSize = num.maxBitSize;
        const bin = this.abs(num).value.toString(2);
        
        if(bin.length > bitSize!)
            throw new Error(`Binary represenation '${bin}' is bigger than the given bit size ${bitSize}`)

        const r = num.value < 0
            ? this.applyTwosComplement(bin.padStart(bitSize, '0'))
            : bin;

        return r;
    },

    lshift (num: BoundedNumber, numBytes : JsNumber) : BoundedNumber {
        return this._apply(num, bin => this.bitwise.lshift(bin, asIntN(numBytes)));
    },

    rshift (num : BoundedNumber, numBytes : JsNumber) : BoundedNumber {
        return this._apply(num, bin => this.bitwise.rshift(bin, asIntN(numBytes)));
    },

    urshift (num : BoundedNumber, numBytes : JsNumber) : BoundedNumber {
        return this._apply(num, bin => this.bitwise.urshift(bin, asIntN(numBytes)));
    },

    _apply(num: BoundedNumber, operation: (bin:string) => string) : BoundedNumber {

        let bin = this.toBinaryString(num).padStart(num.maxBitSize, '0');

        bin = operation(bin);

        let m = BigInt(1);
    
        if(bin['0'] == '1') {
            bin = this.applyTwosComplement(bin);
            m = BigInt(-1);
        }

        const result = BigInt("0b" + bin) * m;
        return asBoundedNumber(typeof num.value == "bigint" ? result : asIntN(result));
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

            if(bin1.length != bin2.length)
                throw new Error("Binary strings must have the same length");

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 || b2 ? "1" : "0");
            }

            return result.join('');
        },
        and (bin1: string, bin2 : string) : string  {

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 && b2 ? "1" : "0");
            }

            return result.join('');
        },
        xor (bin1: string, bin2:string) : string {
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
        }
    }
};

function flip(bit:string):string { 
    return bit === "0" ? "1" : "0";
}