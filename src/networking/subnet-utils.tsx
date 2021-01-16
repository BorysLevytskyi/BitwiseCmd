import { createSubnetMaskByte } from "../core/byte";
import { IpAddress } from "./IpAddress";
import { flipBitsToOne, flipBitsToZero } from '../core/byte';
import { IpAddressWithSubnetMask } from "./IpAddressWithSubnetMask";

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
type FlipFunction = (byte: number, numberOfBits: number) => number; 

export {createSubnetMaskIp, getBroadCastAddress, getNetworkAddress};