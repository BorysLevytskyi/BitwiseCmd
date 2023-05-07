import { Expression } from "../expression/expression-interfaces";
import { INT_MAX_VALUE } from "./const";
import formatter from "./formatter";

export default {
    abs (num : number | bigint) : number | bigint {
        return num >= 0 ? num : -num;
    },
    numberOfBitsDisplayed: function (num: number|bigint) : number {
        
        if(num < 0) {
            return typeof num == 'bigint' ? 64 : 32
        };

        return num.toString(2).length;
    },

    maxNumberOfBitsDisplayed: function (arr: number[]) {

        var counts = [], num;
        for (var i = 0; i < arr.length; i++) {
            num = arr[i];
            counts.push(this.numberOfBitsDisplayed(num));
        }

        return Math.max.apply(null, counts);
    },

    calcExpression: function (expr: Expression) {
        return eval(expr.expressionString);
    },

    flippedBit: function(num: number|bigint, index: number): number  {
        const size = 32;
        const bin = formatter.bin(num).padStart(size, '0');
        const staysNegative = (bin[0] == "1" && index > 0);
        const becomesNegative = (bin[0] == "0" && index == 0);
        
        let m = 1;
        let flipped = bin.substring(0, index) + flip(bin[index]) + bin.substring(index+1);

        if(staysNegative || becomesNegative) {
            flipped = this.applyTwosComplement(flipped);
            m=-1;
        }
       
        return parseInt(flipped, 2)*m;
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

    flipAllBits: (bin: string): string => {
        return bin.split('').map(b => b=="1"?"0":"1").join("");
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