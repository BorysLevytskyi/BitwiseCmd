var app = window.app;
var expression = app.get('expression');

describe("expression parse", function() {

    var shouldParse = ['0x2>>1', '1 2 3', '0x1 1 2 3 5', '0x1>>0x2', '1|2'];

    it("should be able to parse", function() {
       shouldParse.forEach(function(expr) {
           console.log(expr);
           expect(expression.canParse(expr)).toBe(true);
       })
    });

    var expressionCases = {
        "0x2>>1": { operand1: 2, operand2:1, "sign":">>", string:"0x2>>1" },
        "123|111": { operand1: 123, operand2:111, "sign":"|", string: "123|111" },
        "23^0x1": { operand1: 23, operand2:1, "sign":"^", string: "23^0x1" },
        "0xf>>0xa": { operand1: 15, operand2:10, "sign":">>", string:"0xf>>0xa" },
        "0x10&0x11": { operand1: 0x10, operand2:0x11, "sign":"&", string:"0x10&0x11" },
        "0x1a^11": { operand1: 0x1a, operand2:11, "sign":"^", string:"0x1a^11" },
        "0x1a>>>11": { operand1: 0x1a, operand2:11, "sign":">>>", string:"0x1a>>>11" }
    };

    it("should parse expressions", function() {
        var input;
        for(input in expressionCases) {
            var actual = expression.parse(input);
            var expected = expressionCases[input];
            expect(actual).toBeDefined();
            expect(actual).not.toBe(null);
            expect(actual.sign).toBe(expected.sign);
            expect(actual.operand1.value).toBe(expected.operand1);
            expect(actual.operand2.value).toBe(expected.operand2);
            expect(actual.string).toBe(expected.string);
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
            var actual = expression.parse(input);
            var expected = listCases[input];

            for(i =0; i<expected.length;i++) {
                expect(actual.operands[i].value).toBe(expected[i]);
            }
        }
    });
});

describe('parse operands', function() {

    var hexOperand = expression.parseOperand('0x10');
    var decOperand = expression.parseOperand('10');
    rundOperandsTest(hexOperand, decOperand);
});

describe('create operands', function() {

    var hexOperand = expression.createOperand(0x10, 'hex');
    var decOperand = expression.createOperand(10, 'dec');
    rundOperandsTest(hexOperand, decOperand);
});

describe('negative operands', function () {
    var op = expression.parseOperand('-0xa');
    it('shoold have correct values', function() {
        expect(op.value).toBe(-10);
        expect(op.hex).toBe('-0xa');
        expect(op.bin).toBe('11111111111111111111111111110110');
        expect(op.dec).toBe('-10');
        expect(op.kind).toBe('hex');
    })
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
        expect(hexOperand.dec).toBe('16');
        expect(hexOperand.bin).toBe('10000');
        expect(hexOperand.hex).toBe('0x10');
        expect(hexOperand.other).toBe('16');

        expect(decOperand.kind).toBe('dec');
        expect(decOperand.dec).toBe('10');
        expect(decOperand.bin).toBe('1010');
        expect(decOperand.hex).toBe('0xa');
        expect(decOperand.other).toBe('0xa');
    });
}