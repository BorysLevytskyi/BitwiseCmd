import should from './should';

export default calc = {
        numberOfBits: function (num) {
            if(num < 0) {
                return 32;
            }
            should.bePositiveInteger(num);
            return Math.floor(Math.log(num) / Math.log(2)) + 1;
        },

        maxNumberOfBits: function (arr) {

            var counts = [], num;
            for (var i = 0; i < arr.length; i++) {
                num = arr[i];
                counts.push(this.numberOfBits(num));
            }

            return Math.max.apply(null, counts);
        },

        calcExpression: function (expr) {
            return eval(expr.expressionString);
        }
    };