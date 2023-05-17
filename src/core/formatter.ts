import calc from "./calc";
import { Integer, JsNumber, asInteger } from "./Integer";
export type NumberBase = 'dec' | 'hex' | 'bin';

const formatter = {
    numberToString: function(num: Integer | JsNumber, base: NumberBase | number, padLength?: number) : string {
     
        num = asInteger(num);
        base = typeof base == "string" ? getBase(base) : base;

        switch(base) {
            case 16:
                var hexVal = num.abs().value.toString(16);
                return num.value >= 0 ? '0x' + hexVal : '-0x' + hexVal;
            case 2:    
                const bin = calc.toBinaryString(num);
                
                if(padLength == null) 
                    return bin;
                
                const padChar = num.value >= 0 ? '0' : '1';
                return bin.padStart(padLength, padChar);
            case 10:
                return num.value.toString(10);
            default:
                throw new Error("Unexpected kind: " + base)
        }
    },
    padLeft: function (str: string, length: number, symbol: string) : string {
        var sb = Array.prototype.slice.call(str), symbol = symbol || "0";

        if(length == null) {
            return str;
        }

        while(length > sb.length) {
            sb.unshift(symbol);
        }

        return sb.join('');
    },
    bin(number: Integer | JsNumber) {
        return this.numberToString(number, 'bin');
    },
    fullBin(number: Integer) {
        return this.numberToString(number, 'bin', number.maxBitSize);
    },
    emBin(number: Integer | JsNumber) {
        return this.padLeft(this.bin(number), 8, '0');
    },
    
    splitByMasks(ipAddrBin: string, mask1: number, mask2: number) : {vpc: string, subnet: string, hosts:string} {

        var res = [];
        var tmp : string[] = [];
        var mask = 0;
        var b = mask1;

        ipAddrBin.split('').forEach(ch => {
            
            tmp.push(ch);

            if(ch === ".") {
                return;
            }

            mask++;

            if(mask == b) {
                b = mask2;
                res.push(tmp.join(''));
                tmp = [];
            }
        });

        if(tmp.length > 0) res.push(tmp.join(''));

        return { vpc: res[0], subnet: res[1], hosts: res[2]};
    },
    getAlternativeBase: (base: NumberBase) : NumberBase => {
        switch(base) {
            case 'dec': 
            case 'bin':
                return 'hex';
            case 'hex': return 'dec';
            default : throw new Error(base + " kind doesn't have opposite kind")
        }
    }
};

function getBase(kind:string) : number {
    switch (kind){
        case 'bin': return 2;
        case 'hex': return 16;
        case 'dec': return 10;
    }

    throw new Error("Unsupported kind: " + kind);
}

const emBin = formatter.emBin.bind(formatter);
const padLeft = formatter.padLeft.bind(formatter);

export {emBin, padLeft}
export default formatter;