import { createSubnetMaskByte } from "../core/byte";
import { flipBitsToOne, flipBitsToZero } from '../core/byte';
import { IpAddress, IpAddressWithSubnetMask, NetworkClass } from "./models";

function createSubnetMaskIp(ipm: IpAddressWithSubnetMask) : IpAddress {

    const mask = createSubnetMaskByte;
    const maskBits = ipm.maskBits;

    if (maskBits <= 8) {
        return new IpAddress(mask(maskBits), 0, 0, 0);
    }
    else if (maskBits <= 16) {
        return new IpAddress(255, mask(maskBits - 8), 0, 0);
    }
    else if (maskBits <= 24) {
        return new IpAddress(255, 255, mask(maskBits - 16), 0);
    }
    else {
        return new IpAddress(255, 255, 255, mask(maskBits - 24));
    }
}

function getNetworkAddress(ipm: IpAddressWithSubnetMask) : IpAddress {
    return flipSubnetMaskBits(ipm, flipBitsToZero, 0);
}

function getBroadCastAddress(ipm: IpAddressWithSubnetMask) : IpAddress {
    return flipSubnetMaskBits(ipm, flipBitsToOne, 255);
}

function  getAddressSpaceSize(maskSize: number) {
    const spaceLengthInBits = 32 - maskSize;
    return Math.pow(2, spaceLengthInBits) - 2; // 0 - network address, 1 - multicast address
}

function flipSubnetMaskBits(ipm: IpAddressWithSubnetMask, flipper : FlipFunction, fullByte: number) {
    // Cannot treat ip address as a single number operation because 244 << 24 results in a negative number in JS
    const flip = (maskBits: number, byte: number) => flipper(byte, 8 - maskBits);

    const ip = ipm.ipAddress;
    const maskBits = ipm.maskBits;

    if (maskBits <= 8) {
        return new IpAddress(flip(maskBits, ip.firstByte), fullByte, fullByte, fullByte);
    }
    else if (maskBits <= 16) {
        return new IpAddress(ip.firstByte, flip(maskBits - 8, ip.secondByte), fullByte, fullByte);
    }
    else if (maskBits <= 24) {
        return new IpAddress(ip.firstByte, ip.secondByte, flip(maskBits - 16, ip.thirdByte), fullByte);
    }

    else
        return new IpAddress(ip.firstByte, ip.secondByte, ip.thirdByte, flip(maskBits - 24, ip.fourthByte));
}

function getNetworkClass (ipAddress: IpAddress) : NetworkClass {
    const byte = ipAddress.firstByte;

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


type FlipFunction = (byte: number, numberOfBits: number) => number; 

export {createSubnetMaskIp, getBroadCastAddress, getNetworkAddress, getNetworkClass, getAddressSpaceSize};