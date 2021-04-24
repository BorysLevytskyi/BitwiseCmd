import {emBin} from "../core/formatter";
import { getAddressSpaceSize } from "./subnet-utils";

export type OctetNumber = 1 | 2 | 3 | 4;
export type NetworkClass = 'a' | 'b' | 'c' | 'd' | 'e';

export class IpAddressWithSubnetMask {
    maskBits: number;
    ipAddress: IpAddress;

    constructor(ipAddress: IpAddress, maskBits: number) {
        this.ipAddress = ipAddress;
        this.maskBits = maskBits;
    }

    getAdressSpaceSize(): number {
        const spaceLengthInBits = 32 - this.maskBits;
        return getAddressSpaceSize(spaceLengthInBits);
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

    toBinaryString(skipDots?: boolean) {
        
        if(!skipDots)
            return `${emBin(this.firstByte)}.${emBin(this.secondByte)}.${emBin(this.thirdByte)}.${emBin(this.fourthByte)}`;
        else 
            return `${emBin(this.firstByte)}${emBin(this.secondByte)}${emBin(this.thirdByte)}${emBin(this.fourthByte)}`;
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
    cidr: IpAddressWithSubnetMask; // TODO: rename to cidr
    constructor(cidr: IpAddressWithSubnetMask) {
        this.cidr = cidr;
    }
    
    toString() {
        return this.cidr.toString();
    }
}

export class VpcCommand {
    cidr: IpAddressWithSubnetMask;
    subnetBits: number;
    constructor(cidr: IpAddressWithSubnetMask) {
        this.cidr = cidr;
        this.subnetBits = 3;
    }

    toString() {
        return this.cidr.toString();
    }
}
