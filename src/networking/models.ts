export type OctetNumber = 1 | 2 | 3 | 4;
export type NetworkClass = 'a' | 'b' | 'c' | 'd' | 'e';

export class IpAddressWithSubnetMask {
    maskBits: number;
    ipAddress: IpAddress;

    constructor(ipAddress: IpAddress, maskBits: number) {
        this.ipAddress = ipAddress;
        this.maskBits = maskBits;
    }

    toString() {
        return `${this.ipAddress.toString()}/${this.maskBits}`;
    }
}

export class IpAddress {

    firstByte: number;
    secondByte: number;
    thirdByte: number;
    fourthByte: number;

    constructor(firstByte: number, secondByte: number, thirdByte: number, fourthByte: number) {
        this.firstByte = firstByte;
        this.secondByte = secondByte;
        this.thirdByte = thirdByte;
        this.fourthByte = fourthByte;
    }

    toString(): string {
        return `${this.firstByte}.${this.secondByte}.${this.thirdByte}.${this.fourthByte}`;
    }

    clone(): IpAddress {
        return new IpAddress(this.firstByte, this.secondByte, this.thirdByte, this.fourthByte);
    }

    setOctet(octet: OctetNumber, value: number) {
        switch (octet) {
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

export class SubnetCommand {
    input: IpAddressWithSubnetMask;
    constructor(definition: IpAddressWithSubnetMask) {
        this.input = definition;
    }

    getAdressSpaceSize(): number {
        const spaceLengthInBits = 32 - this.input.maskBits;
        return Math.pow(2, spaceLengthInBits) - 2; // 0 - network address, 1 - multicast address
    }

    toString() {
        return this.input.toString();
    }
}

