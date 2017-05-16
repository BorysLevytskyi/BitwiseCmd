var expression = require('../../src/app/expression');
var parser = new expression.Parser();

describe("Parser", function() {

    it("should be able to parse from start", function() {
       var sut = new expression.Parser("test", 0);
       sut.parse();
       console.log(sut);
    });
});