import calc from './calc';
import { Integer, asInteger } from './Integer';
import { INT32_MIN_VALUE, INT32_MAX_VALUE, INT64_MAX_VALUE, INT64_MIN_VALUE, UINT64_MAX_VALUE } from './const';

describe('calc.flipBit', () => {
    it('calculates flipped bit 32-bit number', () => {
        expect(calc.flipBit(0, 31).num()).toBe(1);
        expect(calc.flipBit(1, 31).num()).toBe(0);
        expect(calc.flipBit(-1, 31).num()).toBe(-2);
        expect(calc.flipBit(2147483647, 0).num()).toBe(-1);
        expect(calc.flipBit(-1, 0).num()).toBe(2147483647);
        expect(calc.flipBit(2147483647, 30).num()).toBe(2147483645);
    });

    it('sing-bit in 8-bit number', () => {
        const result = calc.flipBit(new Integer(-1, 8), 0);
        expect(result.maxBitSize).toBe(8);
    });

    it('caulate flipped bit 64-bit nubmer', () => {
        const int64max = asInteger("9223372036854775807");
        expect(calc.flipBit(int64max, 0).num()).toBe(-1);
    });

    it('treats usingned type differently', () => {
        
        const v = BigInt("0b01111111");
        const r = calc.flipBit(new Integer(v, 8), 0);
        
        expect(r.num()).toBe(-1);
        expect(r.signed).toBe(true);

        const ur = calc.flipBit(Integer.unsigned(v, 8), 0)
        expect(ur.num()).toBe(255);
        expect(ur.signed).toBe(false);
    });

    it('calculates flipped bit', () => {
        expect(calc.flipBit(0, 31).num()).toBe(1);
        expect(calc.flipBit(1, 31).num()).toBe(0);
        expect(calc.flipBit(-1, 31).num()).toBe(-2);
        expect(calc.flipBit(2147483647, 0).num()).toBe(-1);
        expect(calc.flipBit(-1, 0).num()).toBe(2147483647);
        expect(calc.flipBit(2147483647, 30).num()).toBe(2147483645);
    });

    it('supports ulong', () => {
        const ulong = calc.flipBit(new Integer(INT64_MAX_VALUE, 64, false), 0);
        expect(ulong.toString()).toBe(UINT64_MAX_VALUE.toString());
    })

});

describe('calc.addSpace', () => {
    it('resizes number based on the space required', () => {
        const n8 = new Integer(1, 8);
        const n16 = new Integer(1, 16); 

        expect(calc.addSpace(n8, 0).maxBitSize).toBe(8);
        expect(calc.addSpace(n8, 1).maxBitSize).toBe(16);
        expect(calc.addSpace(n8, 9).maxBitSize).toBe(32);
        expect(calc.addSpace(n16, 1).maxBitSize).toBe(32);
        expect(calc.addSpace(n16, 32).maxBitSize).toBe(64);
    });

    it('preserves the sign when extending number', () => {
        const byte = Integer.byte(-1);
        const actual = calc.addSpace(byte, 1);
        expect(actual.maxBitSize).toBe(16);
        expect(actual.num()).toBe(-1);
    })
});

describe('calc.numberOfBitsDisplayed', () => {
    it('calculates number of bits', () => {
        expect(calc.numberOfBitsDisplayed(1)).toBe(1);
        expect(calc.numberOfBitsDisplayed(BigInt(-1))).toBe(32);
        expect(calc.numberOfBitsDisplayed(2)).toBe(2);
        expect(calc.numberOfBitsDisplayed(3)).toBe(2);
        expect(calc.numberOfBitsDisplayed(68719476735)).toBe(36);
        expect(calc.numberOfBitsDisplayed(INT32_MIN_VALUE-1)).toBe(64);
    });
});

describe('calc.xor', () => {
    it('positive and negative nubmer', () => {
        expect(calc.xor(Integer.int(-1), Integer.int(10)).num()).toBe(-11);
    });
});

describe('calc.add', () => {
    it('adds positives', () => {
        expect(calc.add(Integer.int(2), Integer.int(3)).num()).toBe(5);
    });

    it('adds negative and positive', () => {
        expect(calc.add(Integer.int(-2), Integer.int(3)).num()).toBe(1);
    });

    it('adds negatives', () => {
        expect(calc.add(Integer.int(-2), Integer.int(-3)).num()).toBe(-5);
    });

    it('wraps on 32-bit overflow', () => {
        expect(calc.add(Integer.int(INT32_MAX_VALUE), Integer.int(1)).num()).toBe(INT32_MIN_VALUE);
        expect(calc.add(Integer.int(INT32_MAX_VALUE), Integer.int(2)).num()).toBe(-2147483647);
    });

    it('wraps on 64-bit overflow', () => {
        const r = calc.add(new Integer(INT64_MAX_VALUE, 64), Integer.long(1));
        expect(r.value.toString()).toBe(INT64_MIN_VALUE.toString());
    });

    it('promotes to larger operand size', () => {
        const r = calc.add(Integer.int(-1), Integer.long(2));
        expect(r.maxBitSize).toBe(64);
        expect(r.num()).toBe(1);
    });
});

describe('calc.sub', () => {
    it('subtracts positives', () => {
        expect(calc.sub(Integer.int(7), Integer.int(2)).num()).toBe(5);
    });

    it('subtracts negative and positive', () => {
        expect(calc.sub(Integer.int(-2), Integer.int(3)).num()).toBe(-5);
    });

    it('subtracts negatives', () => {
        expect(calc.sub(Integer.int(-2), Integer.int(-3)).num()).toBe(1);
    });

    it('wraps on 32-bit overflow', () => {
        // 2147483647 - (-1) = 2147483648 -> -2147483648
        expect(calc.sub(Integer.int(2147483647), Integer.int(-1)).num()).toBe(-2147483648);
        // -2147483648 - 1 = -2147483649 -> 2147483647
        expect(calc.sub(Integer.int(-2147483648), Integer.int(1)).num()).toBe(2147483647);
    });

    it('promotes to larger operand size', () => {
        const r = calc.sub(Integer.int(-1), Integer.long(2));
        expect(r.maxBitSize).toBe(64);
        expect(r.num()).toBe(-3);
    });
});

describe('calc.div', () => {
    it('divides positives with truncation', () => {
        expect(calc.div(Integer.int(7), Integer.int(2)).num()).toBe(3);
    });

    it('divides negative and positive with truncation', () => {
        expect(calc.div(Integer.int(-7), Integer.int(2)).num()).toBe(-3);
        expect(calc.div(Integer.int(7), Integer.int(-2)).num()).toBe(-3);
    });

    it('divides negatives', () => {
        expect(calc.div(Integer.int(-8), Integer.int(-2)).num()).toBe(4);
    });

    it('wraps INT_MIN / -1 to INT_MIN for 32-bit', () => {
        expect(calc.div(Integer.int(-2147483648), Integer.int(-1)).num()).toBe(-2147483648);
    });

    it('64-bit division', () => {
        const r = calc.div(new Integer(INT64_MAX_VALUE, 64), Integer.long(2));
        expect(r.value.toString()).toBe('4611686018427387903');
    });

    it('promotes to larger operand size', () => {
        const r = calc.div(Integer.int(-8), Integer.long(2));
        expect(r.maxBitSize).toBe(64);
        expect(r.num()).toBe(-4);
    });

    it('division by zero throws', () => {
        expect(() => calc.div(Integer.int(1), Integer.int(0))).toThrow();
    });
});

describe('calc.lshift', () => {

    it("respects bit size", () => {
        expect(calc.lshift(new Integer(BigInt("0b0100"), 4), 2).num()).toBe(0);
    });

    it('transitions number to negative', ()=> {
        // 4-bit space
        expect(calc.lshift(new Integer(BigInt("0b0100"), 4), 1).num()).toBe(-8);
        
        // 5-bit space
        expect(calc.lshift(new Integer(BigInt("0b00100"), 5), 1).num()).toBe(8);
        expect(calc.lshift(new Integer(BigInt("0b01000"), 5), 1).num()).toBe(-16);

        // 32-bit
        expect(calc.lshift(new Integer(BigInt("2147483647"), 32), 1).num()).toBe(-2);
        expect(calc.lshift(new Integer(BigInt("2147483647"), 32), 2).num()).toBe(-4);

        // 64-bit
        expect(calc.lshift(new Integer(BigInt("9223372036854775807"), 64), 1).num()).toBe(-2);
        expect(calc.lshift(new Integer(BigInt("9223372036854775807"), 64), 2).num()).toBe(-4);
        expect(calc.lshift(new Integer(BigInt("2147483647"), 64), 1).value.toString()).toBe("4294967294");
        expect(calc.lshift(new Integer(BigInt("2147483647"), 64), 2).value.toString()).toBe("8589934588");
    });

    it('test', () => {
        const actual = calc.lshift(asInteger(100081515), 31).num();
        expect(actual).toBe(-2147483648);
    });

    it('1 to sign bit', () => {
        const actual = calc.lshift(asInteger(1), 31).num();
        expect(actual).toBe(-2147483648);
    });

    it('resizes items if operands have different sizes', () => {
        // -1L|-1 - 64 bit
        // 1123123u|-1 - 64 bit
        const r = calc.or(new Integer(-1, 64), new Integer(-1));
        expect(r.maxBitSize).toBe(64);
        expect(r.num()).toBe(-1);

        expect(() => calc.or(Integer.unsigned(1123123, 32), new Integer(-1))).toThrowError('This operation cannot be applied to signed and unsigned operands of the same size')
    });
});

describe('preserves C compiler behvaior', () => {
    it('lshift same size bytes', () => {
        const int = Integer.int(-1);
        const long = Integer.long(-1);
        
        expect(calc.lshift(int, 32).num()).toBe(int.num());
        expect(calc.lshift(long, 32).num()).toBe(-4294967296);
        expect(calc.lshift(long, 64).num()).toBe(long.num());

        expect(calc.rshift(int, 32).num()).toBe(int.num());
        expect(calc.rshift(long, 32).num()).toBe(-1);
        expect(calc.rshift(long, 64).num()).toBe(long.num());

        expect(calc.urshift(int, 32).num()).toBe(int.num());
        expect(calc.urshift(long, 32).num()).toBe(4294967295);
        expect(calc.urshift(long, 64).num()).toBe(long.num());
    });

    it('shift by bigger numbers of bytes', () => {
        const byte = Integer.byte(-1);
        expect(calc.urshift(byte, 9).num()).toBe(calc.urshift(byte, 1).num());
        expect(calc.urshift(byte, 17).num()).toBe(calc.urshift(byte, 1).num());
        expect(calc.urshift(byte, 18).num()).toBe(calc.urshift(byte, 2).num());

        const int = Integer.int(-1);
        expect(calc.lshift(int, 33).num()).toBe(-2);
        expect(calc.rshift(int, 33).num()).toBe(-1);

        expect(calc.rshift(Integer.int(1), 33).num()).toBe(0);
        expect(calc.rshift(Integer.int(1), 32).num()).toBe(1);
        
        expect(calc.lshift(Integer.byte(1), 20).num()).toBe(16);
    });
});

describe("calc misc", () => {

    it('promoteTo64Bit', () => {
        const n = asInteger(-1);
        expect(calc.toBinaryString(calc.promoteTo64Bit(n))).toBe("11111111111111111111111111111111");
    });

    it('binaryRepresentation', () => {
        
        expect(calc.toBinaryString(Integer.int(-2147483647))).toBe("10000000000000000000000000000001");
        expect(calc.toBinaryString(asInteger(2147483647))).toBe("1111111111111111111111111111111");
    });

    it('not 64bit', () => {
        const actual = calc.not(asInteger("8920390230576132")).toString();
        expect(actual).toBe("-8920390230576133");
    });

    it('numberOfBitsDisplayed appends sign bit', () => {
        const byte = Integer.byte(-127);
        const int = Integer.int(-127);

        expect(calc.numberOfBitsDisplayed(int)).toBe(32);
        expect(calc.numberOfBitsDisplayed(int.abs())).toBe(7);

        // If there is only sign bit left, might as well show it
        expect(calc.numberOfBitsDisplayed(byte)).toBe(8); 
        expect(calc.numberOfBitsDisplayed(byte.abs())).toBe(8); 
    })
});


describe("calc.engine.", () => {
    it("not", () => {
        expect(calc.engine.not("0101")).toBe("1010");
        expect(calc.engine.not("11111")).toBe("00000")
    });

    it("or", () => {
        expect(calc.engine.or("1", "1")).toBe("1");
        expect(calc.engine.or("1", "0")).toBe("1");
        expect(calc.engine.or("0", "0")).toBe("0");
        expect(calc.engine.or("10101", "01111")).toBe("11111");
    });

    it("and", () => {
        expect(calc.engine.and("1", "1")).toBe("1");
        expect(calc.engine.and("1", "0")).toBe("0");
        expect(calc.engine.and("0", "0")).toBe("0");
        expect(calc.engine.and("10101", "11011")).toBe("10001");
    });

    it("xor", () => {
        expect(calc.engine.xor("1", "1")).toBe("0");
        expect(calc.engine.xor("1", "0")).toBe("1");
        expect(calc.engine.xor("0", "0")).toBe("0");
        expect(calc.engine.xor("10101", "11011")).toBe("01110");
    });

    it("add", () => {
        // 1-bit
        expect(calc.engine.add("1", "1")).toBe("0"); // 1 + 1 = 2 -> 0 (wrap)
        expect(calc.engine.add("1", "0")).toBe("1");
        expect(calc.engine.add("0", "0")).toBe("0");

        // 4-bit
        expect(calc.engine.add("0001", "0001")).toBe("0010"); // 1+1=2
        expect(calc.engine.add("0111", "0001")).toBe("1000"); // 7+1=8
        expect(calc.engine.add("1111", "0001")).toBe("0000"); // 15+1=16 -> 0 (wrap)
        expect(calc.engine.add("1111", "1111")).toBe("1110"); // 15+15=30 -> 14
    });

    it("mul", () => {
        // 4-bit unsigned-style values
        expect(calc.engine.mul("0001", "0011")).toBe("0011"); // 1*3=3
        expect(calc.engine.mul("0010", "0011")).toBe("0110"); // 2*3=6
        expect(calc.engine.mul("1111", "0010")).toBe("1110"); // 15*2=30 -> 14

        // two's complement semantics for negatives
        expect(calc.engine.mul("1111", "0011")).toBe("1101"); // (-1)*3 = -3
        expect(calc.engine.mul("1111", "1111")).toBe("0001"); // (-1)*(-1) = 1
        expect(calc.engine.mul("1000", "0010")).toBe("0000"); // (-8)*2 = -16 -> 0

        // 8-bit example
        expect(calc.engine.mul("11111111", "00000010")).toBe("11111110"); // (-1)*2 = -2
    });

    it("sub", () => {
        // 4-bit examples
        expect(calc.engine.sub("0011", "0001")).toBe("0010"); // 3-1=2
        expect(calc.engine.sub("0100", "0000")).toBe("0100"); // 4-0=4
        expect(calc.engine.sub("0100", "0000")).toBe("0100"); // -4-0=-4 (wrap)
        expect(calc.engine.sub("0000", "0001")).toBe("1111"); // 0-1 -> -1
        expect(calc.engine.sub("1000", "0001")).toBe("0111"); // -8-1 -> 7 (wrap)
    });

    it("div", () => {
        // 4-bit unsigned-style values
        expect(calc.engine.div("0110", "0011")).toBe("0010"); // 6/3=2
        expect(calc.engine.div("0111", "0010")).toBe("0011"); // 7/2=3

        // two's complement negatives
        expect(calc.engine.div("1111", "0010")).toBe("0000"); // (-1)/2 = 0 (trunc toward zero)
        expect(calc.engine.div("1000", "0010")).toBe("1100"); // (-8)/2 = -4 -> 1100

        // division by zero
        expect(() => calc.engine.div("0001", "0000")).toThrow();
    });

    it("add", () => {
        // 1-bit
        expect(calc.engine.add("1", "1")).toBe("0"); // 1 + 1 = 2 -> 0 (wrap)
        expect(calc.engine.add("1", "0")).toBe("1");
        expect(calc.engine.add("0", "0")).toBe("0");

        // 4-bit
        expect(calc.engine.add("0001", "0001")).toBe("0010"); // 1+1=2
        expect(calc.engine.add("0111", "0001")).toBe("1000"); // 7+1=8
        expect(calc.engine.add("1111", "0001")).toBe("0000"); // 15+1=16 -> 0 (wrap)
        expect(calc.engine.add("1111", "1111")).toBe("1110"); // 15+15=30 -> 14
    });

    it("mul", () => {
        // 4-bit unsigned-style values
        expect(calc.engine.mul("0001", "0011")).toBe("0011"); // 1*3=3
        expect(calc.engine.mul("0010", "0011")).toBe("0110"); // 2*3=6
        expect(calc.engine.mul("1111", "0010")).toBe("1110"); // 15*2=30 -> 14

        // two's complement semantics for negatives
        expect(calc.engine.mul("1111", "0011")).toBe("1101"); // (-1)*3 = -3
        expect(calc.engine.mul("1111", "1111")).toBe("0001"); // (-1)*(-1) = 1
        expect(calc.engine.mul("1000", "0010")).toBe("0000"); // (-8)*2 = -16 -> 0

        // 8-bit example
        expect(calc.engine.mul("11111111", "00000010")).toBe("11111110"); // (-1)*2 = -2
    });

    it("lshift", () => {
        expect(calc.engine.lshift("1", 1)).toBe("0");
        expect(calc.engine.lshift("01", 1)).toBe("10");
        expect(calc.engine.lshift("01101", 4)).toBe("10000");
        expect(calc.engine.lshift("000001", 4)).toBe("010000");
    });

    it("rshift", () => {
        expect(calc.engine.rshift("1", 1)).toBe("1");
        expect(calc.engine.rshift("01", 1)).toBe("00");
        expect(calc.engine.rshift("0101", 2)).toBe("0001");
        expect(calc.engine.rshift("1000", 3)).toBe("1111");
        expect(calc.engine.rshift("1101", 1)).toBe("1110");
    });

    it("urshift", () => {
        expect(calc.engine.urshift("1", 1)).toBe("0");
        expect(calc.engine.urshift("01", 1)).toBe("00");
        expect(calc.engine.urshift("0101", 2)).toBe("0001");
        expect(calc.engine.urshift("1000", 3)).toBe("0001");
        expect(calc.engine.urshift("1101", 1)).toBe("0110");
    });

    it('flipbit', () => {
        expect(calc.engine.flipBit("1", 0)).toBe("0");
        expect(calc.engine.flipBit("101", 1)).toBe("111");
    });

    it('applyTwosComplement', () => {
        expect(calc.engine.applyTwosComplement("010")).toBe("110");
        expect(calc.engine.applyTwosComplement("110")).toBe("010"); // reverse
        expect(calc.engine.applyTwosComplement("110")).toBe("010");
        expect(calc.engine.applyTwosComplement("0")).toBe("0");
        expect(calc.engine.applyTwosComplement("10101100")).toBe("01010100");
        expect(calc.engine.applyTwosComplement("01010100")).toBe("10101100"); // reverse
    });
});
