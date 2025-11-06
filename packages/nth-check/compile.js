"use strict";

const boolbase = require("boolbase");
const trueFunc = boolbase.trueFunc;
const falseFunc = boolbase.falseFunc;

function compile(parsed) {
  const a = parsed[0];
  const b = parsed[1] - 1;

  if (b < 0 && a <= 0) {
    return falseFunc;
  }

  if (a === -1) {
    return function check(pos) {
      return pos <= b;
    };
  }

  if (a === 0) {
    return function check(pos) {
      return pos === b;
    };
  }

  if (a === 1) {
    return b < 0
      ? trueFunc
      : function check(pos) {
          return pos >= b;
        };
  }

  let bMod = b % a;
  if (bMod < 0) {
    bMod += a;
  }

  if (a > 1) {
    return function check(pos) {
      return pos >= b && pos % a === bMod;
    };
  }

  const posA = -a;

  return function check(pos) {
    return pos <= b && pos % posA === bMod;
  };
}

module.exports = compile;
module.exports.default = compile;
