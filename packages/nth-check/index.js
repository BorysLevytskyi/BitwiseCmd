"use strict";

const parse = require("./parse");
const compile = require("./compile");

function nthCheck(formula) {
  return compile(parse(formula));
}

module.exports = nthCheck;
module.exports.parse = parse;
module.exports.compile = compile;
module.exports.default = nthCheck;
