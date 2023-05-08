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

    flipBit: function(num: BoundedNumber | JsNumber, index: number): BoundedNumber  {

        num = asBoundedNumber(num);
        const is64bit = num.maxBitSize == 64;
        const size = num.maxBitSize;
        const bin = formatter.bin(num.value).padStart(size, '0');
        const staysNegative = (bin[0] == "1" && index > 0);
        const becomesNegative = (bin[0] == "0" && index == 0);
        
        let m = 1;
        let flipped = bin.substring(0, index) + flip(bin[index]) + bin.substring(index+1);

        if(staysNegative || becomesNegative) {
            flipped = this.applyTwosComplement(flipped);
            m=-1;
        }
       
        const n : JsNumber = is64bit ? BigInt("0b"+ flipped)*BigInt(m) : parseInt(flipped, 2)*m;
        return asBoundedNumber(n);
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

    rshift (num: BoundedNumber, numBytes : JsNumber) : BoundedNumber {
        
        const bytes = asIntN(numBytes);
        
        let bin = this.toBinaryString(num).padStart(num.maxBitSize, '0');

        bin = bin.substring(bytes) + "0".repeat(bytes);

        let m = BigInt(1);
    
        if(bin['0'] == '1') {
            bin = this.applyTwosComplement(bin);
            m = BigInt(-1);
        }

        const result = BigInt("0b" + bin) * m;
        return asBoundedNumber(typeof num.value == "bigint" ? result : asIntN(result));
    },

    bitwise: { 
        not: (bin: string) : string  =>  {

            var padded = bin
                .split('').map(c => flip(c))
                .join("");
                
            return padded;
        },
        or: (bin1: string, bin2 : string) : string  =>  {

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 || b2 ? "1" : "0");
            }

            return result.join('');
        },
        and: (bin1: string, bin2 : string) : string  =>  {

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 && b2 ? "1" : "0");
            }

            return result.join('');
        }
    }
};

function flip(bit:string):string { 
    return bit === "0" ? "1" : "0";
}