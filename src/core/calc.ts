import { ExpressionInput } from "../expression/expression-interfaces";
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

    calcExpression: function (expr: ExpressionInput) {
        return eval(expr.expressionString);
    }
};