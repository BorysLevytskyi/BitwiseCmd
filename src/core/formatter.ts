import calc from "./calc";
export type NumberBase = 'dec' | 'hex' | 'bin';

const formatter = {
    numberToString: function(num: number|bigint, base: NumberBase) : string {
     
        switch(base) {
            case 'hex':
                var hexVal = calc.abs(num).toString(16);
                return num >= 0 ? '0x' + hexVal : '-0x' + hexVal;
            case 'bin':          
                
                if(num < 0) {
                    const size = calc.numberOfBitsDisplayed(num);
                    const absBin = calc.abs(num).toString(2).padStart(size, '0');
                    return calc.applyTwosComplement(absBin);
                }
                console.log(num.toString() + " " + num.toString(2))
                return num.toString(2);
            case 'dec':
                return num.toString(10) + (typeof num === "bigint" ? "n" : "");
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
    bin(number: number | bigint) {
        return this.numberToString(number, 'bin');
    },
    emBin(number: number | bigint) {
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