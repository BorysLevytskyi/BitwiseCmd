import { NumericLiteral } from "typescript";
import ExpressionOperand from "./ExpressionOperand";
import { ScalarOperand } from "./expression";
import { ExpressionInputItem } from "./expression-interfaces";
import { type } from "os";

const NUMBER_REGEX = /./;

type TokenDef = {
    regex: RegExp,
    type: string,
    skip?: boolean
}

const decimalRegex = /^-?\d+/;
const hexRegex = /^-?0x[0-9,a-f]+/i;
const binRegex = /^-?0b[0-1]+/i;
const operatorRegex = /^<<|>>|<<<|\&|\|\^|~/;

type Token = {
    value: string,
    type: string,
}

const TOKENS: TokenDef[] = [
    { regex: /^>>>/, type: "operator-urightshift"},
    { regex: /^>>/, type: "operator-rightshift"},
    { regex: /^<</, type: "operator-rightshift"},
    { regex: /^\^/, type: "operator-xor"},
    { regex: /^\|/, type: "operator-or"},
    { regex: /^\&/, type: "operator-and"},
    { regex: /^~/, type: "operator-not"},
    { regex: /^-/, type: "operator-subtraction"},
    { regex: hexRegex, type: "scalar-hex" },
    { regex: binRegex, type: "scalar-binary" },
    { regex: decimalRegex, type: "scalar-decimal" },
    { regex: /^\s+/, type: "whitespace", skip: true }
];

function tokenize(input: string): string[] {
    let cur = input;
    const found: string[] = [];

    while (true) {

        try {
            const firstToken = findFirst(TOKENS, t => t.regex.test(cur));

            const match = firstToken.regex.exec(cur)!;
            const value = match[0];

            if (!firstToken.skip)
                found.push(value);

            if (cur.length == value.length)
                break;

            cur = cur.substring(value.length);
        }
        catch (ex) {
            console.log("cur: \"" + cur + "\"");
            throw ex;
        }
    }

    return found;
}

function findFirst<T>(arr: T[], predicate: (item: T) => boolean): T {
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i]))
            return arr[i];
    }

    throw new Error("Array doesn't have item that satisfies given predicate");
}

it("parses simple expression", () => {
    expect(tokenize("~-0>>>1>>2|3&4^5")).toEqual(["~", "-", "0", ">>>", "1", ">>", "2", "|", "3", "&", "4", "^", "5"]);
    expect(tokenize("-1>>>1>>2")).toEqual(["-", "1", ">>>", "1", ">>", "2"]);
    expect(tokenize("-1")).toEqual(["-", "1"]);
    expect(tokenize("123 0b0101 0xaf")).toEqual(["123", "0b0101", "0xaf"]);
    expect(tokenize("123 987")).toEqual(["123", "987"]);
})