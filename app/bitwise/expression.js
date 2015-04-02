(function(bitwise) {
   var twoOperandsRegex = /^(\d+)(<<|>>|\||\&|\^)(\d+)$/;

    app.service('expression', {
        parse: function(string) {
            var matches = twoOperandsRegex.exec(string);
            if(matches == null) {
                return null;
            }

            console.log(matches);

            return {
                string:matches[0],
                operand1: parseInt(matches[1], 10),
                sign: matches[2],
                operand2: parseInt(matches[3], 10),
                result: function() {
                    return eval(string);
                }
            }
        }
    });

})(window.app);