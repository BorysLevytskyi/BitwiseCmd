import formatter from '../core/formatter';


export type OctetNumber = 1 | 2 | 3 | 4;
export type NetworkClass = 'a' | 'b' | 'c' | 'd' | 'e';

const ipAddressParser = {
    parse: function(input: string) : IpAddress | IpAddressWithSubnetMask | ValueOutOfRange | null {

        const ipV4Regex = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})(\/\d{1,2})?$/;
        const matches = ipV4Regex.exec(input);

        if(matches == null || matches.length === 0)
            return null;

        const invalid = (n: number) => n < 0 || n > 255;
    
        const first = parseInt(matches[1]);
        const second = parseInt(matches[2]);
        const third = parseInt(matches[3]);
        const fourth = parseInt(matches[4]);

        if(invalid(first) || invalid(second) || invalid(third) || invalid(fourth))
            return new ValueOutOfRange(`${input} value doesn't fall within the valid range of the IP address space`);

        const ipAddress = new IpAddress(first, second, third, fourth);

        if(matches[5]) {
            const maskPart = matches[5].substr(1);
            const maskBits = parseInt(maskPart);

            if(maskBits > 32) {
                return new ValueOutOfRange('Subnet mask value is out of range');
            }

            return new IpAddressWithSubnetMask(ipAddress, maskBits);
        }

        return ipAddress;
    }
}

export class ValueOutOfRange {
    message: string;
    constructor(message: string) {
        this.message = message;
    }
}

export class IpAddressWithSubnetMask {
    maskBits: number;
    ipAddress: IpAddress;
    
    constructor(ipAddress : IpAddress, maskBits : number) {
        this.ipAddress = ipAddress;
        this.maskBits = maskBits;
    }

    toString() {
        return `${this.ipAddress.toString()}/${this.maskBits}`;
    }

    createSubnetMaskIp() : IpAddress {

        const mask = (bits: number) => 255<<(8-bits)&255;

        if(this.maskBits <= 8) {
            return new IpAddress(mask(this.maskBits), 0, 0, 0);
        }
        else if(this.maskBits <= 16) {
            return new IpAddress(255, mask(this.maskBits-8), 0, 0);
        }
        else if(this.maskBits <= 24) {
            return new IpAddress(255, 255, mask(this.maskBits-16), 0);
        }
        else {
            return new IpAddress(255, 255, 255, mask(this.maskBits-24));
        }
    }
}

export class IpAddress {

    firstByte : number;
    secondByte: number;
    thirdByte : number;
    fourthByte: number

    constructor(firstByte : number, secondByte: number, thirdByte : number, fourthByte: number) {
        this.firstByte = firstByte;
        this.secondByte = secondByte;
        this.thirdByte = thirdByte;
        this.fourthByte = fourthByte;
    }

    toString() : string {
        return `${this.firstByte}.${this.secondByte}.${this.thirdByte}.${this.fourthByte}`;
    }

    setOctet(octet: OctetNumber, value : number)  {
        switch(octet) {
            case 1:
                this.firstByte = value;
                break;
            case 2:
                this.secondByte = value;
                break;
            case 3:
                this.thirdByte = value;
                break;
            case 4:
                this.fourthByte = value;
                break;
        }
    }
}



const getNetworkClass = function (ipAddress: IpAddress) : NetworkClass {
    const byte = ipAddress.firstByte;
    const bineryRep = formatter.formatString(ipAddress.firstByte, 'bin');

    const firstBitOne = (byte & 128) === 128;
    const firstBitZero = (byte & 128) === 0;
    const secondBitOne = (byte & 64) === 64;

    const thirdBitOne = (byte & 32) === 32;
    const thirdBitZero = (byte & 32) === 0;

    const forthBitZero = (byte & 16) === 0;
    const forthBitOne = (byte & 16) === 16;

    // e: 1111

    if(firstBitOne && secondBitOne && thirdBitOne && forthBitOne)
        return 'e';

    if(firstBitOne && secondBitOne && thirdBitOne && forthBitZero) // Start bits: 1110;
        return 'd';

    if(firstBitOne && secondBitOne && thirdBitZero) // Start bits: 110;
        return 'c';
   
    return firstBitOne ? 'b' : 'a';
};

export {ipAddressParser, getNetworkClass};