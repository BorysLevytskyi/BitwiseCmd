var expression = require('../../src/app/expression');
var parser = expression.parser;

describe("operand", function() {
    it("should be able to create opearand from positive binary string", function() {
        var input = "0b10";
        var op = new expression.Operand.parse(input);
        expect(op.value).toBe(2);
        expect(op.kind).toBe('bin');
    });

    it("should be able to create opearand from negative binary string", function() {
        var input = "-0b10";
        var op = new expression.Operand.parse(input);
        expect(op.value).toBe(-2);
        expect(op.kind).toBe('bin');
    })
});
