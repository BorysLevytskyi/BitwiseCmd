describe("expression parse", function() {
    var app = window.app;
    var expression = app.get('expression');

    var expressionsCases = {
        "1 2 3": { numbers: [1,2,3] },
        "1": { numbers: [1] },
        "2>>1": { operand1: 2, operand2:1, "sign":">>", string:"2>>1" },
        "123|111": { operand1: 123, operand2:111, "sign":"|", string: "123|111" },
        "23^1": { operand1: 23, operand2:1, "sign":"^", string: "23^1" }
    };

    it("should parse decimal expressions", function() {
        var input, expr;
        for(input in expressionsCases) {
            expect(expression.canParse(input)).toBe(true);
            expr = expression.parse(input);
            expect(JSON.stringify(expr)).toEqual(JSON.stringify(expressionsCases[input]));
        }
    });
});