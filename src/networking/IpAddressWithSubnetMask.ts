import { createSubnetMaskByte } from '../core/byte';
import { IpAddress } from './IpAddress';


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
