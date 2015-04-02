(function(app, should){
    var calc = {};

    calc.numberOfBits = function(num) {
        should.bePositiveInteger(num);
        return Math.floor(Math.log(num) / Math.log(2)) + 1;
    };

    calc.maxNumberOfBits = function () {

        var counts = [], num;
        for(var i=0;i<arguments.length; i++)
        {
            num = arguments[i];
            counts.push(this.numberOfBits(num));
        }

        return Math.max.apply(null, counts);
    };

    app.service('calc', calc);

})(window.app, window.should);
