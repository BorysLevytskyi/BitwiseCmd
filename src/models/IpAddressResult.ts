import { IpAddress, ipAddressParser } from '../ipaddress/ip';
import CommandResult from './CommandResult';

export default class IpAddressResult extends CommandResult {
    ipAddress: IpAddress;
    constructor(input: string, ipAddress: IpAddress) {
        super(input);
        this.ipAddress = ipAddress;
    }
}