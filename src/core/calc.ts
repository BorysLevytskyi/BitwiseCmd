import { Expression } from "../expression/expression-interfaces";
import { INT_MAX_VALUE } from "./const";

export default {
    numberOfBitsDisplayed: function (num: number) : number {
        if(num < 0) {
            return Math.abs(num) <= INT_MAX_VALUE ? 32 : 64;
        }

        return Math.floor(Math.log(num) / Math.log(2)) + 1;
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

    flippedBit: function(bin: string, index: number): number  {
        
        // Negative number
        if(bin.length == 32 && bin[0] == "0") {
            const reversed = this.applyTwosComplement(bin);
            console.log("reversed",reversed);
            return -parseInt(reversed, 2);
        }

        return 0;
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

function flip(bit:string) { 
    return bit === "0" ? "1" : "0";
}