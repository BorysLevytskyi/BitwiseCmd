"use strict";

function parse(formula) {
  if (typeof formula !== "string") {
    throw new SyntaxError("nth-check formula must be a string");
  }

  let value = formula.trim().toLowerCase();
  if (value.length === 0) {
    throw new SyntaxError("nth-check formula is empty");
  }

  if (value === "even") {
    return [2, 0];
  }

  if (value === "odd") {
    return [2, 1];
  }

  const indexOfN = value.indexOf("n");

  if (indexOfN !== -1) {
    const aPartRaw = value.slice(0, indexOfN).trim();
    let a;

    if (aPartRaw === "" || aPartRaw === "+") {
      a = 1;
    } else if (aPartRaw === "-") {
      a = -1;
    } else {
      a = parseSignedInt(aPartRaw);
    }

    let rest = value.slice(indexOfN + 1).trim();
    if (rest.length === 0) {
      return [a, 0];
    }

    let sign = 1;
    if (rest[0] === "+" || rest[0] === "-") {
      sign = rest[0] === "-" ? -1 : 1;
      rest = rest.slice(1).trim();
    }

    if (rest.length === 0) {
      throw new SyntaxError("Invalid nth-check formula");
    }

    const b = parseUnsignedInt(rest) * sign;
    return [a, b];
  }

  return [0, parseSignedInt(value)];
}

function parseSignedInt(input) {
  let sign = 1;
  let start = 0;
  if (input[start] === "+" || input[start] === "-") {
    sign = input[start] === "-" ? -1 : 1;
    start += 1;
  }

  const value = parseUnsignedInt(input.slice(start));
  return sign * value;
}

function parseUnsignedInt(input) {
  if (input.length === 0) {
    throw new SyntaxError("Expected integer in nth-check formula");
  }

  let value = 0;
  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);
    if (code < 48 || code > 57) {
      throw new SyntaxError("Invalid digit in nth-check formula");
    }
    value = value * 10 + (code - 48);
  }

  return value;
}

module.exports = parse;
module.exports.default = parse;
