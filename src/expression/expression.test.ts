import { parser, ListOfNumbers, BitwiseOperation, Operand, Operator } from "./expression";
import { random } from "../core/utils";
import { INT32_MAX_VALUE } from "../core/const";

describe("expression parser", () => {

    it("parses list of number expression", () => {
        var result = parser.parse("1 2 3");
        expect(result).toBeInstanceOf(ListOfNumbers);
    });

    it("doesn't list of numbers in case of bad numbers", () => {
        expect(parser.parse("1 2 z")).toBeNull();
        expect(parser.parse("")).toBeNull();
    });

    it("pares different operations expressions", () => {
        expect(parser.parse("~1")).toBeInstanceOf(BitwiseOperation);
        expect(parser.parse("1^2")).toBeInstanceOf(BitwiseOperation);
        expect(parser.parse("1|2")).toBeInstanceOf(BitwiseOperation);
        expect(parser.parse("1*2")).toBeInstanceOf(BitwiseOperation);
        expect(parser.parse("1-2")).toBeInstanceOf(BitwiseOperation);
        expect(parser.parse("1/2")).toBeInstanceOf(BitwiseOperation);
    });

    it("parses big binary bitwise expression", () => {
        const input = "0b00010010001101000101011001111000 0b10101010101010101010101000000000";
        const actual = parser.parse(input);
        expect(actual).toBeInstanceOf(ListOfNumbers);

        const expr = actual as ListOfNumbers;
        expect(expr.children[0].getUnderlyingOperand().value.toString()).toBe('305419896');
        expect(expr.children[1].getUnderlyingOperand().value.toString()).toBe('2863311360');
    })

    it("parses addition operation", () => {
        const expr = parser.parse("23 + 34") as BitwiseOperation;
        expect(expr.children.length).toBe(2);
        
        expect(expr.children[1]).toBeInstanceOf(Operator);
        expect((expr.children[1] as Operator).operator).toBe("+");
        expect(expr.children[0].getUnderlyingOperand().value.toString()).toBe('23');
        expect(expr.children[1].getUnderlyingOperand().value.toString()).toBe('34')
    });

    it("parses multiplication operation", () => {
        const expr = parser.parse("23 * 34") as BitwiseOperation;
        expect(expr.children.length).toBe(2);

        expect(expr.children[1]).toBeInstanceOf(Operator);
        expect((expr.children[1] as Operator).operator).toBe("*");
        expect(expr.children[0].getUnderlyingOperand().value.toString()).toBe('23');
        expect(expr.children[1].getUnderlyingOperand().value.toString()).toBe('34')
    });

    it("parses division operation", () => {
        const expr = parser.parse("23 / 34") as BitwiseOperation;
        expect(expr.children.length).toBe(2);

        expect(expr.children[1]).toBeInstanceOf(Operator);
        expect((expr.children[1] as Operator).operator).toBe("/");
        expect(expr.children[0].getUnderlyingOperand().value.toString()).toBe('23');
        expect(expr.children[1].getUnderlyingOperand().value.toString()).toBe('34')
    });

    it("parses subtraction operation", () => {
        const expr = parser.parse("23 - 34") as BitwiseOperation;
        expect(expr.children.length).toBe(2);

        expect(expr.children[1]).toBeInstanceOf(Operator);
        expect((expr.children[1] as Operator).operator).toBe("-");
        expect(expr.children[0].getUnderlyingOperand().value.toString()).toBe('23');
        expect(expr.children[1].getUnderlyingOperand().value.toString()).toBe('34')
    });

    it("pares multiple operand expression", () => {       
        const result = parser.parse("1^2") as BitwiseOperation;
        expect(result.children.length).toBe(2);

        const first = result.children[0];
        const second = result.children[1];

        expect(first).toBeInstanceOf(Operand);

        expect((first as Operand).value.toString()).toBe("1");

        expect(second).toBeInstanceOf(Operator);
        var secondOp = second as Operator;
        expect(secondOp.operator).toBe("^");

        expect(secondOp.operand).toBeInstanceOf(Operand);
        var childOp = secondOp.operand as Operand;
        expect(childOp.value.toString()).toBe('2');
    });

    it("bug", () => {       
        var result = parser.parse("1|~2") as BitwiseOperation;
        expect(result.children.length).toBe(2);
    });

    it("bug2", () => {
        const result = parser.parse('0b0000000000000000001000010001011110000010100000001 & (0b0000000000000000001000010001011110000010100000001 >> 7)');
        expect(result).toBeNull();
    })
});

describe("multiplication", () => {
    it("evaluates simple products", () => {
        const expr = parser.parse("2*3") as BitwiseOperation;
        const res = (expr.children[1] as Operator).evaluate(expr.children[0] as Operand);
        expect(res.value.toString()).toBe('6');

        const expr2 = parser.parse("-2*3") as BitwiseOperation;
        const res2 = (expr2.children[1] as Operator).evaluate(expr2.children[0] as Operand);
        expect(res2.value.toString()).toBe('-6');
    });

    it("wraps on 32-bit overflow", () => {
        const expr = parser.parse("2147483647*2") as BitwiseOperation;
        const res = (expr.children[1] as Operator).evaluate(expr.children[0] as Operand);
        expect(res.value.toString()).toBe('-2');
    });

    it("wraps on 64-bit overflow", () => {
        const expr = parser.parse("9223372036854775807l*2l") as BitwiseOperation;
        const res = (expr.children[1] as Operator).evaluate(expr.children[0] as Operand);
        expect(res.value.toString()).toBe('-2');
    });
});

describe("division", () => {
    it("evaluates simple quotients with truncation", () => {
        const expr1 = parser.parse("7/2") as BitwiseOperation; // -> 3
        const res1 = (expr1.children[1] as Operator).evaluate(expr1.children[0] as Operand);
        expect(res1.value.toString()).toBe('3');

        const expr2 = parser.parse("-7/2") as BitwiseOperation; // -> -3
        const res2 = (expr2.children[1] as Operator).evaluate(expr2.children[0] as Operand);
        expect(res2.value.toString()).toBe('-3');

        const expr3 = parser.parse("1/2") as BitwiseOperation; // -> 0
        const res3 = (expr3.children[1] as Operator).evaluate(expr3.children[0] as Operand);
        expect(res3.value.toString()).toBe('0');
    });

    it("handles INT_MIN/-1 based on parsed width", () => {
        // Parser promotes -2147483648 to 64-bit (abs value exceeds INT32_MAX),
        // so the result is a positive 64-bit 2147483648.
        const expr = parser.parse("-2147483648/-1") as BitwiseOperation;
        const res = (expr.children[1] as Operator).evaluate(expr.children[0] as Operand);
        expect(res.value.toString()).toBe('2147483648');
    });

    it("64-bit division", () => {
        const expr = parser.parse("9223372036854775807l/2l") as BitwiseOperation;
        const res = (expr.children[1] as Operator).evaluate(expr.children[0] as Operand);
        expect(res.value.toString()).toBe('4611686018427387903');
    });
});

describe("comparison with nodejs engine", () => {
    
    it('set 32-bit', () => {
        
        const inputs = [
            "1485578196>>14",
            "921979543<<31",
            "1123|324",
            "213&9531",
            "120^442161",
            "1<<7",
            "2>>>8",
            "2<<7"
        ];

        inputs.forEach(i => testBinary(i, i));
    });

    it('random: two inbary strings 64-bit', () => {
        
        const signs = ["|", "&", "^", "<<", ">>", ">>>", "*", "/", "-"]

        for(var i =0; i<1000; i++){

            const sign = signs[random(0, signs.length-1)];
            const isShift = sign.length > 1;
            const op1 = random(-INT32_MAX_VALUE, INT32_MAX_VALUE);
            const op2 = isShift ? random(0, 31) : random(-INT32_MAX_VALUE, INT32_MAX_VALUE);
            
            const input = op1.toString() + sign + op2.toString();
            
            if (sign === "*") {
                // Use BigInt to avoid precision issues and wrap to 32-bit two's complement
                const modulo = (BigInt(1) << BigInt(32));
                const expectedNum = ((BigInt(op1) * BigInt(op2)) % modulo + modulo) % modulo;
                const expectedSigned = expectedNum >= (BigInt(1) << BigInt(31)) ? expectedNum - modulo : expectedNum;
                const expr = parser.parse(input) as BitwiseOperation;
                const res = (expr.children[1] as Operator).evaluate(expr.children[0] as Operand).value.toString();
                expect(res).toBe(expectedSigned.toString());
            } else if (sign === "/") {
                const denom = op2 === 0 ? 1 : op2;
                const q = BigInt(op1) / BigInt(denom); // trunc toward zero
                const modulo = (BigInt(1) << BigInt(32));
                const expectedNum = ((q % modulo) + modulo) % modulo;
                const expectedSigned = expectedNum >= (BigInt(1) << BigInt(31)) ? expectedNum - modulo : expectedNum;
                const expr = parser.parse(op1.toString() + '/' + denom.toString()) as BitwiseOperation;
                const res = (expr.children[1] as Operator).evaluate(expr.children[0] as Operand).value.toString();
                expect(res).toBe(expectedSigned.toString());
            } else if (sign === "-") {
                const diff = BigInt(op1) - BigInt(op2);
                const modulo = (BigInt(1) << BigInt(32));
                const expectedNum = ((diff % modulo) + modulo) % modulo;
                const expectedSigned = expectedNum >= (BigInt(1) << BigInt(31)) ? expectedNum - modulo : expectedNum;
                const expr = parser.parse(input) as BitwiseOperation;
                const res = (expr.children[1] as Operator).evaluate(expr.children[0] as Operand).value.toString();
                expect(res).toBe(expectedSigned.toString());
            } else {
                testBinary(input, input);
            }
        }
    });

    it('random: 64 and 32-bit', () => {

        for(var i =0; i<1000; i++){
           
            const num = random(-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const actualInput = "~" + num.toString();
            const expectedInput = num > INT32_MAX_VALUE ? `~BigInt("${num}")` : actualInput;
            const expected = eval(expectedInput).toString();
        
            let actual = "";

            try
            {
                const expr = parser.parse(actualInput) as BitwiseOperation;
                const bo = (expr.children[0] as Operator);
                const res = bo.evaluate();
                actual = res.value.toString();

                if(actual !== expected) {
                    const uop = bo.getUnderlyingOperand();
                    console.log(`Expected:${expectedInput}\nActual:${actualInput}\n${uop.value} ${uop.value.maxBitSize}\n${res.value} ${typeof res.value} ${res.value.maxBitSize}`)
                }
            }
            catch(err) 
            {

                console.log(`Error:\nExpected:${expectedInput}\nActual:${actualInput}\n${typeof actualInput}`);

                throw err;
            }
        
            expect(actual).toBe(expected);   
        }
    });

    it('random: two inbary strings 64-bit', () => {
        
        const signs = ["|", "&", "^"]

        for(var i =0; i<1000; i++){
            const sign = signs[random(0, signs.length-1)];
            const isShift = sign.length > 1;
            const op1 = random(-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const op2 = isShift ? random(0, 63) : Number.MAX_SAFE_INTEGER;
            
            const actualInput = `${op1}l${sign}${op2}l`;
            const expectedInput = `BigInt("${op1}")${sign}BigInt("${op2}")`; 

            testBinary(expectedInput, actualInput);
        }
    });
    
    function testBinary(expectedInput:string, actualInput: string) {
        
        const expected = eval(expectedInput).toString();
        
        let actual = "";
        
        try
        {
            var expr = parser.parse(actualInput) as BitwiseOperation;

            var op1 = expr.children[0] as Operand;
            var op2 = expr.children[1] as Operator;

            actual = op2.evaluate(op1).value.toString();
            const equals = actual === expected;

            if(!equals)
            {
                console.log(`Expected:${expectedInput}\n$Actual:${actualInput}\nop1:${typeof op1.value}\nop2:${typeof op2.getUnderlyingOperand().value}`);
            }
        }
        catch(err) 
        {
            console.log(`Error:\nExpected:${expectedInput}\nActual:${actualInput}\n${typeof actualInput}`);
            throw err;
        }
        
        expect(actual).toBe(expected);
    }
});
