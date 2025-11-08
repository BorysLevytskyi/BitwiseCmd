import { Integer, JsNumber,  asInteger } from "./Integer";
import { asIntN } from "./utils";

const calc = {

    numberOfBitsDisplayed: function (num: Integer | JsNumber) : number {
        const n = asInteger(num);
        const len = this.toBinaryString(n).length;
        return (len + 1) === n.maxBitSize ? n.maxBitSize : len; // Include sign bit if it is all that left
    },

    flipBit: function(num: Integer | JsNumber, bitIndex: number): Integer  {
        return this._executeForSingleOperand(asInteger(num), (bin) => this.engine.flipBit(bin, bitIndex));
    },

    promoteTo64Bit(number: Integer) : Integer {
        const bin = this.toBinaryString(number);
        return new Integer(BigInt("0b" + bin), 64);
    },

    addSpace(number: Integer, requiredSpace: number) : Integer {

        if(requiredSpace < 0)
            throw new Error("Required space cannot be negative");

        const totalSpaceRequired = number.maxBitSize + requiredSpace;
        return new Integer(number.value, nextPowOfTwo(totalSpaceRequired));
    },

    operation (op1: Integer, operator: string, op2 : Integer) : Integer {
       
        switch(operator) {
            case ">>": return this.rshift(op1, op2.value);
            case ">>>": return this.urshift(op1, op2.value);
            case "<<": return this.lshift(op1, op2.value);
            case "&": return this.and(op1,op2);
            case "|": return this.or(op1,op2);
            case "^": return this.xor(op1,op2);
            case "+": return this.add(op1,op2);
            case "*": return this.mul(op1, op2);
            case "/": return this.div(op1, op2);
            default: throw new Error(operator + " operator is not supported");
        }
    },

    toBinaryString(num: Integer) : string {
        const bitSize = num.maxBitSize;
        const bin = num.abs().value.toString(2);
        
        if(bin.length > bitSize!)
            throw new Error(`Binary represenation '${bin}' is bigger than the given bit size ${bitSize}`)

        const r = num.value < 0
            ? this.engine.applyTwosComplement(bin)
            : bin;

        return bin.length !== bitSize ? r.substring(r.length-bin.length) : r;
    },

    lshift (num: Integer, numBytes : JsNumber) : Integer {

        let bytes = asIntN(numBytes);

        if(num.maxBitSize === bytes)
            return num; // Preserve C undefined behavior
        
        while(bytes > num.maxBitSize) bytes -= num.maxBitSize;

        return this._executeForSingleOperand(num, bin => this.engine.lshift(bin, bytes));
    },

    rshift (num : Integer, numBytes : JsNumber) : Integer {
        
        let bytes = asIntN(numBytes);

        if(num.maxBitSize === bytes)
            return num; // Preserve C undefined behavior
        
        while(bytes > num.maxBitSize) bytes -= num.maxBitSize;

        return this._executeForSingleOperand(num, bin => this.engine.rshift(bin, bytes));
    },

    urshift (num : Integer, numBytes : JsNumber) : Integer {

        let bytes = asIntN(numBytes);

        if(num.maxBitSize === bytes)
            return num; // Preserve C undefined behavior
        
        while(bytes > num.maxBitSize) bytes -= num.maxBitSize;

        return this._executeForSingleOperand(num, bin => this.engine.urshift(bin, bytes));
    },

    not(num:Integer) : Integer { 
        return this._executeForSingleOperand(num, this.engine.not);
    },

    and (num1 : Integer, num2 : Integer) : Integer {
        return this._executeForTwoOperands(num1, num2, this.engine.and);
    },

    or (num1 : Integer, num2 : Integer) : Integer {
        return this._executeForTwoOperands(num1, num2, this.engine.or);
    },

    xor (num1 : Integer, num2 : Integer) : Integer {
        return this._executeForTwoOperands(num1, num2, this.engine.xor);
    },
    
    mul (num1: Integer, num2: Integer) : Integer {
        return this._executeForTwoOperands(num1, num2, this.engine.mul);
    },
    
    div (num1: Integer, num2: Integer) : Integer {
        return this._executeForTwoOperands(num1, num2, this.engine.div);
    },

    add(num1: Integer, num2: Integer) : Integer {
       return this._executeForTwoOperands(num1, num2, this.engine.add);
    },

    _executeForSingleOperand(num: Integer, operation: (bin:string) => string) : Integer {

        let bin = this.toBinaryString(num).padStart(num.maxBitSize, num.value < 0 ? '1' : '0');

        bin = operation(bin);

        let negative = false;

        if(num.signed && bin[0] === '1') {
            bin = this.engine.applyTwosComplement(bin);
            negative = true;
        }

        const result = BigInt("0b" + bin) * BigInt(negative ? -1 : 1);
        return new Integer(typeof num.value === "bigint" ? result : asIntN(result), num.maxBitSize, num.signed);
    },

    _executeForTwoOperands(op1: Integer, op2: Integer,  operation: (bin1:string, bin2:string) => string) : Integer {
        
        if(op1.maxBitSize === op2.maxBitSize && op1.signed !== op2.signed)
            throw new Error("This operation cannot be applied to signed and unsigned operands of the same size");

        const [num1, num2] = equalizeSize(op1, op2);

        let bin1 = this.toBinaryString(num1).padStart(num1.maxBitSize, num1.value < 0  ? '1' : '0');
        let bin2 = this.toBinaryString(num2).padStart(num2.maxBitSize, num2.value < 0  ? '1' : '0');

        let resultBin = operation(bin1, bin2);

        let m = BigInt(1);
    
        if(resultBin[0] === '1') {
            resultBin = this.engine.applyTwosComplement(resultBin);
            m = BigInt(-1);
        }

        const result = BigInt("0b" + resultBin) * m;
        return new Integer(result, num1.maxBitSize);
    },

    engine: { 
        lshift (bin: string, bytes: number):string {
            return bin.substring(bytes) + "0".repeat(bytes);
        },
        rshift (bin: string, bytes: number):string {
            const pad = bin[0].repeat(bytes);
            return pad + bin.substring(0, bin.length - bytes);
        },
        urshift (bin: string, bytes: number):string {
            const pad = '0'.repeat(bytes);
            return pad + bin.substring(0, bin.length - bytes);
        },
        not (bin: string) : string {

            return bin
                .split('').map(c => flip(c))
                .join("");
        },
        or (bin1: string, bin2 : string) : string  {

            checkSameLength(bin1, bin2);

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 || b2 ? "1" : "0");
            }

            return result.join('');
        },
        and (bin1: string, bin2 : string) : string  {

            checkSameLength(bin1, bin2);

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 && b2 ? "1" : "0");
            }

            return result.join('');
        },
        xor (bin1: string, bin2:string) : string {

            checkSameLength(bin1, bin2);

            const result = [];
            for(var i=0; i<bin1.length; i++) {
                
                const b1 = bin1[i] === "1";
                const b2 = bin2[i] === "1";

                result.push(b1 !== b2 ? "1" : "0");
            }

            return result.join('');
        },
        add (bin1: string, bin2:string) : string {
            checkSameLength(bin1, bin2);
            const len = bin1.length;
            let carry = 0;
            const out: string[] = new Array(len);

            for (let i = len - 1; i >= 0; i--) {
                const b1 = bin1[i] === '1' ? 1 : 0;
                const b2 = bin2[i] === '1' ? 1 : 0;
                const sum = b1 + b2 + carry;
                out[i] = (sum % 2) === 1 ? '1' : '0';
                carry = sum >= 2 ? 1 : 0;
            }

            // Overflow carry is discarded to keep fixed width
            return out.join('');
        },
        mul (bin1: string, bin2: string) : string {
            checkSameLength(bin1, bin2);
            const len = bin1.length;

            const toSignedBigInt = (bin: string) => {
                if (bin[0] === '1') {
                    const mag = BigInt('0b' + calc.engine.applyTwosComplement(bin));
                    return -mag;
                }
                return BigInt('0b' + bin);
            };

            const a = toSignedBigInt(bin1);
            const b = toSignedBigInt(bin2);
            const product = a * b;

            const modulo = (BigInt(1) << BigInt(len));
            const wrapped = ((product % modulo) + modulo) % modulo;
            return wrapped.toString(2).padStart(len, '0');
        },
        div (bin1: string, bin2: string) : string {
            checkSameLength(bin1, bin2);
            const len = bin1.length;

            const toSignedBigInt = (bin: string) => {
                if (bin[0] === '1') {
                    const mag = BigInt('0b' + calc.engine.applyTwosComplement(bin));
                    return -mag;
                }
                return BigInt('0b' + bin);
            };

            const a = toSignedBigInt(bin1);
            const b = toSignedBigInt(bin2);
            if (b === BigInt(0))
                throw new Error('Division by zero');

            const quotient = a / b; // BigInt division truncates toward zero

            const modulo = (BigInt(1) << BigInt(len));
            const wrapped = (((quotient % modulo) + modulo) % modulo);
            return wrapped.toString(2).padStart(len, '0');
        },
        flipBit(bin: string, bitIndex : number) : string {
            return bin.substring(0, bitIndex) + flip(bin[bitIndex]) + bin.substring(bitIndex+1)
        },
        applyTwosComplement: (bin:string):string => {
            var lastIndex = bin.lastIndexOf('1');
        
            // If there exists no '1' concat 1 at the
            // starting of string
            if (lastIndex === -1)
                return "1" + bin;
        
            // Continue traversal backward after the position of
            // first '1'
            var flipped =[];
            for (var i = lastIndex - 1; i >= 0; i--) {
                // Just flip the values
                flipped.unshift(bin.charAt(i) === "1" ? "0" : "1");
            }
        
            const result =  flipped.join('') + bin.substring(lastIndex);
            //logLines(bin + " " + bin.length, result + " " + result.length);
            return result;
        },
    }
};

export default calc;

function checkSameLength(bin1: string, bin2: string) {
    if (bin1.length !== bin2.length)
        throw new Error("Binary strings must have the same length");
}

function flip(bit:string):string { 
    return bit === "0" ? "1" : "0";
}

function nextPowOfTwo(num: number) : number {
    let p = 2;
    while(p < num) p = p*2;
    return p;
}

// Promotes both numbers to the same size using the size of the bigger one
function equalizeSize(n1: Integer, n2: Integer) : [Integer, Integer] {
    if(n1.maxBitSize === n2.maxBitSize)
    {
        if(n1.signed === n2.signed) return [n1,n2];

        // Example int and usinged int. Poromoted both to 64 bit
        return [n1.resize(n1.maxBitSize*2).toSigned(), n2.resize(n2.maxBitSize*2).toSigned()];
    }
    
    return n1.maxBitSize > n2.maxBitSize  
        ? [n1, n2.convertTo(n1)] 
        : [n1.convertTo(n2), n2];
}

/*
        // c#
        var op = -1;
		var r = op>>>33;
		Console.WriteLine(Convert.ToString(op, 2).PadLeft(32, '0'));
		Console.WriteLine(Convert.ToString(r,2).PadLeft(32, '0'));
		Console.WriteLine(Convert.ToString(r));
		Console.WriteLine(r.GetType().Name);
*/
