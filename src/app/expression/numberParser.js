var decimalRegex = /^-?\d+$/;
var hexRegex = /^-?0x[0-9,a-f]+$/i;
var binRegex = /^-?0b[0-1]+$/i;
var operatorRegex = /^<<|>>|<<<|\&|\|\^|~$/;

var parsers = [
    { regex: decimalRegex, radix: 10, kind: 'dec', prefix: '^$' },
    { regex: hexRegex, radix: 16, kind: 'hex', prefix:/0x/i },
    { regex: binRegex, radix: 2, kind: 'bin', prefix:/0b/i }];

function applyParser(parser, rawInput) {
    
    if(!parser.regex.test(rawInput)) {
        return null;
    }
        
    var value = parseInt(rawInput.replace(parser.prefix, ''), parser.radix);

    return {
        value: value,
        kind: parser.kind,
        input: rawInput
    }    
}

var parser = {
    parse: function(input) {
        return parsers.map(p => applyParser(p, input)).reduce((c, n) => c || n);
    },

    parseOperator: function(input) {
        var m = input.match(input);
        if(m.length == 0) {
            return null;
        }

        return m[0];
    }
}

export default parser;