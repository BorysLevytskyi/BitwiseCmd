app.set('expression', function() {
    "use strict";

    var exprRegex = /^(\d+|0x[\d,a-f]+)\s*(<<|>>|\||\&|\^)\s*(\d+|0x[\d,a-f]+)$/;
    var listRegex = /^((\d+|0x[\d,a-f]+)\s?)+$/

    return {
        canParse: function(string, mode) {
            return exprRegex.test(string) || listRegex.test(string);
        },
        parse: function(string, mode) {
            mode = (mode || 'dec');

            var trimmed = string.replace(/^\s+|\s+$/, '');
            var base = getBase(mode);
            var matches = exprRegex.exec(trimmed);

            if(matches != null) {
                return createCalculableExpression(matches, base);
            }

            matches = listRegex.exec(string);
            if(matches != null) {
                return createListOfNumbersExpression(string, base)
            }
        },
        parseOperand: function(input) {
            return new Operand(input);
        },
        createOperand: function(number, kind) {
            var str = number.toString(getBase(kind));
            if(kind == 'hex') {
                str = "0x" + str;
            }

            return new Operand(str);
        }

    };

    function createCalculableExpression(matches, base) {

        var m = new app.models.BitwiseOperation();
        m.operand1 = new Operand(matches[1]);
        m.operand2 = new Operand(matches[3]);
        m.sign = matches[2];
        m.string = matches.input;
        //m.result = eval(matches.input);

        return m;
    }

    function createListOfNumbersExpression(input, base) {
        var operands = [];
        input.split(' ').forEach(function(n){
            if(n.trim().length > 0) {
                operands.push(new Operand(n.trim()));
            }

        });

        return new app.models.BitwiseNumbers(operands);
    }

    function getBase(mode) {
        switch (mode){
            case 'bin': return 2;
            case 'hex': return 16;
            case 'dec': return 10;
        }
    }

    function Operand(input) {
        // console.log('input: ' + input);
        this.input = input;
        this.value = parseInt(input);
        // console.log('value: ' + this.value);
        this.hex = '0x' + this.value.toString(16);
        this.dec = this.value.toString(10);
        this.bin = this.value.toString(2);
        this.kind = this.input.indexOf('0x') == 0 ? 'hex' : 'dec';
        this.other = this.kind == 'dec' ? this.hex : this.dec;
    }

    Operand.prototype.valueOf = function () {
        return this.value;
    };
});