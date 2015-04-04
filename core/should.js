(function(){
    "use strict";
    
    window.core.should = {
        beNumber: function (num, name) {
            this.check(typeof num == "number" && !isNaN(num), num + " is not a number");
            this.check(isFinite(num), append(name, "is an infinite number"));
        },

        bePositiveInteger: function(num, name) {
            this.beNumber(num);
            this.check(num >= 0, append(name, "should be positive integer"));
        },

        notBeNull: function (obj, name) {
            this.check(obj != null, append(name, "is null or undefined"));
        },

        beString: function(obj, name) {
            this.check(typeof obj == "string", "should be a string");
        },
        check: function(assertion, message) {
            if(assertion !== true) {
                throw new Error (message);
            }
        }
    };

    function append(name, msg) {
        return typeof name == "string" ? name + " " + msg : msg;
    }
})();


