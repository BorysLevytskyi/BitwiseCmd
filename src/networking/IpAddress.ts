import { OctetNumber } from './ip';


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
