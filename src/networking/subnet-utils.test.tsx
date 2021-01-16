import { IpAddress } from "./IpAddress";
import { IpAddressWithSubnetMask } from "./IpAddressWithSubnetMask";
import {createSubnetMaskIp,getBroadCastAddress,getNetworkAddress} from './subnet-utils';

describe('utils', () => {
    it('createSubnetMaskIp', () => {
        const ip = new IpAddress(127, 0, 0, 1);
        const mask = (n: number) => new IpAddressWithSubnetMask(ip, n);

        expect(createSubnetMaskIp(mask(1)).toString()).toBe('128.0.0.0');
        expect(createSubnetMaskIp(mask(8)).toString()).toBe('255.0.0.0');
        expect(createSubnetMaskIp(mask(10)).toString()).toBe('255.192.0.0');
        expect(createSubnetMaskIp(mask(20)).toString()).toBe('255.255.240.0');
        expect(createSubnetMaskIp(mask(30)).toString()).toBe('255.255.255.252');
        expect(createSubnetMaskIp(mask(32)).toString()).toBe('255.255.255.255');
    });

    it('getNetworkAddress', () => {
        const ipm = (f:number, s:number, t:number, fr:number, m:number) =>
            new IpAddressWithSubnetMask(new IpAddress(f,s,t,fr), m);
    
        expect(getNetworkAddress(ipm(192,188,107,11, 12)).toString())
            .toBe('192.176.0.0');
    
        expect(getNetworkAddress(ipm(192,168,123,1, 20)).toString())
            .toBe('192.168.112.0');

        expect(getNetworkAddress(ipm(192,168,123,1, 23)).toString())
            .toBe('192.168.122.0');
            
        expect(getNetworkAddress(ipm(192,168,5,125, 28)).toString())
            .toBe('192.168.5.112');
        
        expect(getNetworkAddress(ipm(255,255,255,253, 30)).toString())
            .toBe('255.255.255.252');
    });

    it('getBroadcastAddress', () => {
        const ipm = (f:number, s:number, t:number, fr:number, m:number) =>
            new IpAddressWithSubnetMask(new IpAddress(f,s,t,fr), m);
    
        expect(getBroadCastAddress(ipm(192,188,107,11, 12)).toString())
            .toBe('192.191.255.255');
    
        expect(getBroadCastAddress(ipm(192,168,123,1, 20)).toString())
            .toBe('192.168.127.255');

        expect(getBroadCastAddress(ipm(192,168,123,1, 23)).toString())
            .toBe('192.168.123.255');
            
        expect(getBroadCastAddress(ipm(192,168,5,125, 28)).toString())
            .toBe('192.168.5.127');
        
        expect(getBroadCastAddress(ipm(255,255,255,253, 30)).toString())
            .toBe('255.255.255.255');
    });
});