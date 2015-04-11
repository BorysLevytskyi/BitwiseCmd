describe("expression parse", function() {
    var app = window.app;
    var expression = app.get('expression');

    var decCases = {
        "1 2 3": { numbers: [1,2,3] },
        "1": { numbers: [1] },
        "2>>1": { operand1: 2, operand2:1, "sign":">>", string:"2>>1" },
        "123|111": { operand1: 123, operand2:111, "sign":"|", string: "123|111" },
        "23^1": { operand1: 23, operand2:1, "sign":"^", string: "23^1" }
    };

    var hexCases = {
        "1 10 f" : { numbers: [1, 16, 15] },
        "f>>a": { operand1: 15, operand2:10, "sign":">>", string:"f>>a" },
        "10&11": { operand1: 16, operand2:17, "sign":"&", string:"10&11" },
        "10^11": { operand1: 16, operand2:17, "sign":"^", string:"10^11" }
    };

    it("should parse decimal expressions", function() {
        var input, expr;
        for(input in decCases) {
            expect(expression.canParse(input)).toBe(true);
            expr = expression.parse(input);
            expect(JSON.stringify(expr)).toEqual(JSON.stringify(decCases[input]));
        }
    });

    it("should parse hexadecimal expressions", function() {
        var input, expr;
        for(input in hexCases) {
            console.log('input: ' + input)
            expect(expression.canParse(input, 'hex')).toBe(true);
            expr = expression.parse(input, 'hex');
            expect(JSON.stringify(expr)).toEqual(JSON.stringify(hexCases[input]));
        }
    });
});