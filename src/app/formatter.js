export default {
        formatString: function(num, kind) {
            return num.toString(getBase(kind || "bin"));
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

    function getBase(kind) {
        switch (kind){
            case 'bin': return 2;
            case 'hex': return 16;
            case 'dec': return 10;
        }
    }