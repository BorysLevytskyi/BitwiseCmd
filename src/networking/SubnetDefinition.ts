import { timeStamp } from 'console';
import { IpAddress } from './IpAddress';
import { IpAddressWithSubnetMask } from "./IpAddressWithSubnetMask";


export class SubnetDefinition {
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

