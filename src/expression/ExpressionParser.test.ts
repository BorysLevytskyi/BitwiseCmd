import Operator from "./Operator";
import { Operand } from "./expression";
import { ExpressionElement } from "./expression-interfaces";
import { type } from "os";
import { InputType } from "zlib";
import exp from "constants";

const NUMBER_REGEX = /./;

type TokenDef = {
    regex: RegExp,
    type: string,
    skip?: boolean
}

const decimalRegex = /^-?\d+/;
const hexRegex = /^-?0x[0-9,a-f]+/i;
const binRegex = /^-?0b[0-1]+/i;

type Token = {
    value: string,
    type: string,
}

type TreeNodeType =  "operator" | "scalar";

type TreeNode = {
    children: TreeNode[],
    image: string 
    type: TreeNodeType
}

const TOKENS: TokenDef[] = [
    { regex: /^\(/, type: "parenthesis-left" },
    { regex: /^\)/, type: "parenthesis-right" },
    { regex: /^>>>/, type: "operator-urightshift"},
    { regex: /^>>/, type: "operator-rightshift"},
    { regex: /^<</, type: "operator-rightshift"},
    { regex: /^\^/, type: "operator-xor"},
    { regex: /^\|/, type: "operator-or"},
    { regex: /^\&/, type: "operator-and"},
    { regex: /^~/, type: "operator-not"},
    { regex: hexRegex, type: "scalar-hex" },
    { regex: binRegex, type: "scalar-binary" },
    { regex: decimalRegex, type: "scalar-decimal" },
    { regex: /^\s+/, type: "whitespace", skip: true }
];

type parentFactory = (children : TreeNode[]) => TreeNode;

function tokenize(input: string): Token[] {
    let cur = input;
    const found: Token[] = [];

    while (true) {

        try {
            const firstToken = findFirst(TOKENS, t => t.regex.test(cur));

            const match = firstToken.regex.exec(cur)!;
            const value = match[0];

            if (!firstToken.skip)
                found.push({value: value, type: firstToken.type});

            if (cur.length === value.length)
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

function tokenizeString(input: string) : string[] {
    return tokenize(input).map(t => t.value);
}

function parse(tokens: Token[]) : TreeNode[] {
    const nodes : TreeNode[]  = [];

    for(var i = 0; i<tokens.length; i++) {

        const c = tokens[i];
        const n = i < tokens.length-1 ? tokens[i+1] : null;

        if(c.type.startsWith("scalar")) {
            nodes.push({ image: c.value, type: "scalar", children:[] });
            continue;
        }
    }

    return nodes;
}

function findFirst<T>(arr: T[], predicate: (item: T) => boolean): T {
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i]))
            return arr[i];
    }

    throw new Error("Array doesn't have item that satisfies given predicate");
}

it("tokenizes simple expression", () => {
    expect(tokenizeString("~-0>>>1>>2|(3&4^5)")).toEqual(["~", "-0", ">>>", "1", ">>", "2", "|", "(", "3", "&", "4", "^", "5", ")"]);
    expect(tokenizeString("-1>>>1>>2")).toEqual(["-1", ">>>", "1", ">>", "2"]);
    expect(tokenizeString("-1")).toEqual(["-1"]);
    expect(tokenizeString("123 0b0101 0xaf")).toEqual(["123", "0b0101", "0xaf"]);
    expect(tokenizeString("123 987")).toEqual(["123", "987"]);
});

it("parsers tokenized list of numbers expression", () => {
    const tokens = tokenize("123 0b0101 0xaf");
    const expr = parse(tokens);

    expect(expr.length).toBe(3);
});

xit("parsers tokenized parenthesis expression", () => {
    const tokens = tokenize("(1)");
    const expr = parse(tokens);

    expect(expr.length).toBe(1);
});