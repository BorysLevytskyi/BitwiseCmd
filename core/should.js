(function(){
    window.core.should = {
        beNumber: function (num, name) {
            this.check(typeof num == "number" && !isNaN(num), num + " is not a number");
            this.check(isFinite(num), num + "is an infinite number")
        },

        bePositiveInteger: function(num) {
            this.beNumber(num);
            this.check(num >= 0, "Should be positive integer")
        },

        notBeNull: function (obj, name) {
            this.check(obj != null, name + " is null or undefined");
        },

        beString: function(obj) {
            this.check(typeof obj == "string", "should be a string");
        },
        check: function(assertion, message) {
            if(assertion !== true) {
                throw new Error (message);
            }
        }
    };
})();


