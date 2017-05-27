var expression = require('../../src/app/expression');
var parser = expression.parser;

describe("expression parser", function() {

    var shouldParse = ['0x2>>1', '1 2 3', '0x1 1 2 3 5', '0x1>>0x2', '1|2', '-9', '-1|-2', '~3'];
    it("should be able to parse", function() {
       shouldParse.forEach(function(expr) {
           expect(parser.canParse(expr)).toBe(true, 'expr: ' + expr);
       })
    });

    var expressionCases = {
        "0x2>>1": { operand1: 2, operand2:1, "sign":">>", string:"0x2>>1" },
        "123|111": { operand1: 123, operand2:111, "sign":"|", string: "123|111" },
        "23^0x1": { operand1: 23, operand2:1, "sign":"^", string: "23^0x1" },
        "0xf>>0xa": { operand1: 15, operand2:10, "sign":">>", string:"0xf>>0xa" },
        "0x10&0x11": { operand1: 0x10, operand2:0x11, "sign":"&", string:"0x10&0x11" },
        "0x1a^11": { operand1: 0x1a, operand2:11, "sign":"^", string:"0x1a^11" },
        "0x1a>>>11": { operand1: 0x1a, operand2:11, "sign":">>>", string:"0x1a>>>11" },
        '~3': { operand1: 3, operand2: null, "sign":"~", string:"~3" },
        '~0xa': { operand1: 0xa, operand2: null, "sign":"~", string:"~0xa" },
        '~-0xa': { operand1: -0xa, operand2: null, "sign":"~", string:"~-0xa" }
    };

    // TODO: update to support multiple expressions
    xit("should parse expressions", function() {

        for(input in expressionCases) {
            console.log('case: ' + input);
            var actual = parser.parse(input);
            var expected = expressionCases[input];
            
            console.log('actual:' + actual.toString());

            // expect(actual).toBeDefined();
            // expect(actual).not.toBe(null);
            // expect(actual.sign).toBe(expected.sign);
            // expect(actual.operand1.value).toBe(expected.operand1);

            // if(expected.operand2 != null) {
            //     expect(actual.operand2.value).toBe(expected.operand2);
            // }
            // else
            // {
            //     expect(actual.operand2).not.toBeDefined();
            // }

            // expect(actual.expressionString).toBe(expected.string);
            // console.log(actual.toString());
        }
    });

    var listCases = {
        '-0xa -9' : [-10, -9],
        '1 2 3': [1, 2, 3],
        '0x1 2 0xa6b': [0x1, 2, 0xa6b],
        '0x11a': [0x11a]
    };

    it("should parse hexadecimal expressions", function() {
        var input, i;
        for(input in listCases) {
            var actual = parser.parse(input);
            var expected = listCases[input];

            for(i =0; i<expected.length;i++) {
                expect(actual.numbers[i].value).toBe(expected[i]);
                expect(actual.expressionString).toBe(input)
            }
        }
    });

    it ("should parse multiple operands expression", function () {
        var actual = parser.parse("1|2&3");
    })
});

describe('parse operands', function() {

    var hexOperand = parser.parseOperand('0x10');
    var decOperand = parser.parseOperand('10');
    rundOperandsTest(hexOperand, decOperand);
});

describe('create operands', function() {

    var hexOperand = parser.createOperand(0x10, 'hex');
    var decOperand = parser.createOperand(10, 'dec');
    rundOperandsTest(hexOperand, decOperand);
});

describe('negative operands', function () {
    var op = parser.parseOperand('-0xa');
    it('shoold have correct values', function() {
        expect(op.value).toBe(-10);
        expect(op.toHexString()).toBe('-0xa');
        expect(op.toBinaryString()).toBe('11111111111111111111111111110110');
        expect(op.toDecimalString()).toBe('-10');
        expect(op.kind).toBe('hex');
    })
});

describe('should format to kind strings', function() {
    var dec = expression.Operand.toKindString(15, 'dec'),
        hexNegative = expression.Operand.toKindString(-2, 'hex'),
        hex = expression.Operand.toKindString(11, 'hex'),
        bin = expression.Operand.toKindString(10, 'bin');

    it('should be correctly formatted', function() {
        expect(dec).toBe('15');
        expect(hexNegative).toBe('-0x2');
        expect(hex).toBe('0xb');
        expect(bin).toBe('1010')
    });
});

function rundOperandsTest(hexOperand, decOperand) {
    it('should remember input form', function() {
        expect(hexOperand.input).toBe('0x10');
        expect(decOperand.input).toBe('10');
    });

    it('should return integer value', function () {
        expect(hexOperand.value).toBe(0x10);
        expect(decOperand.value).toBe(10);
    });

    it('should have all kinds', function () {

        expect(hexOperand.kind).toBe('hex');
        expect(hexOperand.toDecimalString()).toBe('16');
        expect(hexOperand.toBinaryString()).toBe('10000');
        expect(hexOperand.toHexString()).toBe('0x10');
        expect(hexOperand.toOtherKindString()).toBe('16');

        expect(decOperand.kind).toBe('dec');
        expect(decOperand.toDecimalString()).toBe('10');
        expect(decOperand.toBinaryString()).toBe('1010');
        expect(decOperand.toHexString()).toBe('0xa');
        expect(decOperand.toOtherKindString()).toBe('0xa');
    });
}