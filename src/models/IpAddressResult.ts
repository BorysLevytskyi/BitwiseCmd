import { IpAddress, ipAddressParser, IpAddressWithSubnetMask } from '../ipaddress/ip';
import CommandResult from './CommandResult';

export default class IpAddressResult extends CommandResult {
    ipAddresses: IpAddress[];
    constructor(input: string, ipAddresses: IpAddress[]) {
        super(input);
        this.ipAddresses = ipAddresses;
    }
}