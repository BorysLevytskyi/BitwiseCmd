import { INT_MAX_VALUE } from "./const";
export type NumberBase = 'dec' | 'hex' | 'bin';

const formatter = {
    numberToString: function(value: number, kind: NumberBase) : string {
     
        switch(kind) {
            case 'hex':
                var hexVal = Math.abs(value).toString(16);
                return value >= 0 ? '0x' + hexVal : '-0x' + hexVal;
            case 'bin':          
                if(value < 0) {
                    const n = Math.abs(value);
                    const padding = n > INT_MAX_VALUE ? 64 : 32;
                    const pos = n.toString(2).padStart(padding, '0');
                    return findTwosComplement(pos);
                }
                
                return value.toString(getBase(kind || "bin"));
            case 'dec':
                return value.toString(10);
            default:
                throw new Error("Unexpected kind: " + kind)
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
    bin(number: number) {
        return this.numberToString(number, 'bin');
    },
    emBin(number: number) {
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

function flip(bit: string) : string {
    switch(bit) {
        case "1": return "0";
        case "0": return "1";
        default: throw new Error("unexpected bit value: " + bit);
    }
}

function findTwosComplement(str:string):string {
    var n = str.length;

    // Traverse the string to get first '1' from
    // the last of string
    var i;
    for (i = n - 1; i >= 0; i--)
        if (str.charAt(i) == '1')
            break;

    // If there exists no '1' concat 1 at the
    // starting of string
    if (i == -1)
        return "1" + str;

    // Continue traversal after the position of
    // first '1'
    for (var k = i - 1; k >= 0; k--) {
        // Just flip the values
        if (str.charAt(k) == '1')
            str = str.substring(0,k)+"0"+str.substring(k+1, str.length);
        else
            str = str.substring(0,k)+"1"+str.substring(k+1, str.length);
    }

    // return the modified string
    return str.toString();
}

const emBin = formatter.emBin.bind(formatter);
const padLeft = formatter.padLeft.bind(formatter);

export {emBin, padLeft}
export default formatter;