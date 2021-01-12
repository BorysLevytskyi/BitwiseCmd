import { ExpressionInput } from "../expression/expression-interfaces";

export default {
    numberOfBits: function (num: number) : number {
        if(num < 0) {
            return 32;
        }

        return Math.floor(Math.log(num) / Math.log(2)) + 1;
    },

    maxNumberOfBits: function (arr: number[]) {

        var counts = [], num;
        for (var i = 0; i < arr.length; i++) {
            num = arr[i];
            counts.push(this.numberOfBits(num));
        }

        return Math.max.apply(null, counts);
    },

    calcExpression: function (expr: ExpressionInput) {
        return eval(expr.expressionString);
    }
};