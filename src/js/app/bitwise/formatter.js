app.set("formatter", function() {
    "use strict";

    var should = app.get('should');
    var is = app.get('is');

    return {
        formatString: function(num, mode) {
            mode = mode || "bin";

            var convertedString = num.toString(getBase(mode));
            return convertedString;

        },
        padLeft: function (str, length, symbol) {
            var sb = Array.prototype.slice.call(str), symbol = symbol || "0";

            if(length == null) {
                return str;
            }

            while(length > sb.length) {
                sb.unshift(symbol);
            }

            return sb.join('');
        }
    };



    function getBase(mode) {
        switch (mode){
            case 'bin': return 2;
            case 'hex': return 16;
            case 'dec': return 10;
        }
    }
});