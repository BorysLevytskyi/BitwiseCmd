import { parser, ListOfNumbersExpression, BitwiseOperationExpression, ScalarValue, BitwiseOperator } from "./expression";
import { random } from "../core/utils";
import { INT32_MAX_VALUE } from "../core/const";

describe("expression parser", () => {

    it("pares list of number expression", () => {
        var result = parser.parse("1 2 3");
        expect(result).toBeInstanceOf(ListOfNumbersExpression);
    });

    it("doesn't list of numbers in case of bad numbers", () => {
        expect(parser.parse("1 2 z")).toBeNull();
        //expect(parser.parse("-")).toBeNull();
        expect(parser.parse("")).toBeNull();
    });

    it("pares different operations expressions", () => {
        expect(parser.parse("~1")).toBeInstanceOf(BitwiseOperationExpression);
        expect(parser.parse("1^2")).toBeInstanceOf(BitwiseOperationExpression);
        expect(parser.parse("1|2")).toBeInstanceOf(BitwiseOperationExpression);
    });

    it("parses big binary bitwise expression", () => {
        const input = "0b00010010001101000101011001111000 0b10101010101010101010101000000000";
        const actual = parser.parse(input);
        expect(actual).toBeInstanceOf(ListOfNumbersExpression);

        const expr = actual as ListOfNumbersExpression;
        expect(expr.children[0].getUnderlyingScalarOperand().value.toString()).toBe('305419896');
        expect(expr.children[1].getUnderlyingScalarOperand().value.toString()).toBe('2863311360');
    })

    it("pares multiple operand expression", () => {       
        const result = parser.parse("1^2") as BitwiseOperationExpression;
        expect(result.children.length).toBe(2);

        const first = result.children[0];
        const second = result.children[1];

        expect(first).toBeInstanceOf(ScalarValue);

        expect((first as ScalarValue).value).toBe(1);

        expect(second).toBeInstanceOf(BitwiseOperator);
        var secondOp = second as BitwiseOperator;
        expect(secondOp.operator).toBe("^");

        expect(secondOp.operand).toBeInstanceOf(ScalarValue);
        var childOp = secondOp.operand as ScalarValue;
        expect(childOp.value.toString()).toBe('2');
    });

    it("bug", () => {       
        var result = parser.parse("1|~2") as BitwiseOperationExpression;
        expect(result.children.length).toBe(2);
    });
});

describe("comparison with nodejs engone", () => {
    
    it('set 32-bit', () => {
        
        const inputs = [
            "921979543<<31",
            "1123|324",
            "213&9531",
            "120^442161",
            "1<<7",
            "2>>>8",
            "2<<7"
        ];

        inputs.forEach(testBinary);
    });

    it('random 32-bit', () => {
        
        const signs = ["|", "&", "^", "<<", ">>", ">>>"]

        for(var i =0; i<1000; i++){
            const sign = signs[random(0, signs.length-1)];
            const isShift = sign.length > 1;
            const op1 = random(-INT32_MAX_VALUE, INT32_MAX_VALUE);
            const op2 = isShift ? random(0, 31) : random(-INT32_MAX_VALUE, INT32_MAX_VALUE);
            const input = op1.toString() + sign + op2.toString();
            testBinary(input);
        }
    });
    
    function testBinary(input: string) {
        const expected = eval(input).toString();
        let actual = "";
        try
        {
            var expr = parser.parse(input) as BitwiseOperationExpression;

            var op1 = expr.children[0] as ScalarValue;
            var op2 = expr.children[1] as BitwiseOperator;

            expect(op1.isBigInt()).toBe(false);
            expect(op2.getUnderlyingScalarOperand().isBigInt()).toBe(false);

            actual = op2.evaluate(op1).value.toString();
            const equals = actual === expected;

            if(!equals)
            {
                console.log(`${input}\nop1:${typeof op1.value}\nop2:${typeof op2.getUnderlyingScalarOperand().value}`);
            }
        }
        catch(err) 
        {
            console.log(input);
            throw err;
        }
        
        expect(actual).toBe(expected);
    }
});