import { dblClick } from "@testing-library/user-event/dist/click";
import { Expression } from "../expression/expression-interfaces";
import { INT_MAX_VALUE } from "./const";
import { start } from "repl";

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