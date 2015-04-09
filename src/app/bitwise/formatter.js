app.compose(function() {
    "use strict";

    var should = app.get('should');
    app.set("formatter", {
        toBinaryString: function(num, totalLength) {

            var binaryStr = num.toString(2),
                formatted = [],
                i;

            if(totalLength != null) {
                should.bePositiveInteger(totalLength);
            }

            for(i = 0; i<binaryStr.length; i++) {
                formatted.push(binaryStr[i]);
            }

            while(totalLength > formatted.length) {
                formatted.unshift('0');
            }

            return formatted.join('');
        }
    });
})
