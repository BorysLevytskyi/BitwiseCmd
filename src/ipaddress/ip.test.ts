import {IpAddress, ipAddressParser, getNetworkClass, ValueOutOfRange, IpAddressWithSubnetMask} from './ip';


describe('parser tests', () => {
    it('can parse correct ip address', () => {
        const actual = ipAddressParser.parse('127.1.2.3');
        const expected = new IpAddress(127, 1, 2, 3);
        expect(actual).not.toBe(null);
        expect(actual!.toString()).toBe(expected.toString());
    });

    it('cannot parse incorrect ip address', () => {
        expect(ipAddressParser.parse('abc')).toBe(null);
        expect(ipAddressParser.parse('')).toBe(null);
    });

    it('should parse invalid ip address', () => {
        expect(ipAddressParser.parse('256.0.0.0')).toBeInstanceOf(ValueOutOfRange);
        expect(ipAddressParser.parse('0.256.0.0')).toBeInstanceOf(ValueOutOfRange);
        expect(ipAddressParser.parse('0.0.256.0')).toBeInstanceOf(ValueOutOfRange);
        expect(ipAddressParser.parse('0.0.0.256')).toBeInstanceOf(ValueOutOfRange);
    });

    it('parses correct ip and subnet mask', () => {
        const result = ipAddressParser.parse('127.0.0.1/24');
        expect(result).toBeInstanceOf(IpAddressWithSubnetMask);
        expect(result!.toString()).toBe('127.0.0.1/24');

        const x = result as IpAddressWithSubnetMask;
        expect(x.maskBits).toBe(24);
    });
});

describe('getNetworkClass tests', () => {
    it('detects class a', () => {
        expect(getNetworkClass(new IpAddress(1, 0, 0, 0))).toBe('a');
        expect(getNetworkClass(new IpAddress(55, 0, 0, 0))).toBe('a');
        expect(getNetworkClass(new IpAddress(97, 0, 0, 0))).toBe('a');
        expect(getNetworkClass(new IpAddress(127, 0, 0, 0))).toBe('a');
    });

    it('detects class b', () => {
        expect(getNetworkClass(new IpAddress(128, 0, 0, 0))).toBe('b');
        expect(getNetworkClass(new IpAddress(134, 0, 0, 0))).toBe('b');
        expect(getNetworkClass(new IpAddress(180, 0, 0, 0))).toBe('b');
        expect(getNetworkClass(new IpAddress(191, 0, 0, 0))).toBe('b');
    });

    it('detects class c', () => {
        expect(getNetworkClass(new IpAddress(192, 0, 0, 0))).toBe('c');
        expect(getNetworkClass(new IpAddress(218, 0, 0, 0))).toBe('c');
        expect(getNetworkClass(new IpAddress(223, 0, 0, 0))).toBe('c');
    });

    it('detects class d', () => {
        expect(getNetworkClass(new IpAddress(224, 0, 0, 0))).toBe('d');
        expect(getNetworkClass(new IpAddress(234, 0, 0, 0))).toBe('d');
        expect(getNetworkClass(new IpAddress(239, 0, 0, 0))).toBe('d');
    });

    it('detects class e', () => {
        expect(getNetworkClass(new IpAddress(240, 0, 0, 0))).toBe('e');
        expect(getNetworkClass(new IpAddress(241, 0, 0, 0))).toBe('e');
        expect(getNetworkClass(new IpAddress(255, 0, 0, 0))).toBe('e');
    });
});

describe('IpAddressWithSubnetMask tests', () => {

    it('creates subnetmask ip', () => {
        const ip = new IpAddress(127, 0, 0, 1);
        expect(new IpAddressWithSubnetMask(ip, 1).createSubnetMaskIp().toString()).toBe('128.0.0.0');
        expect(new IpAddressWithSubnetMask(ip, 8).createSubnetMaskIp().toString()).toBe('255.0.0.0');
        expect(new IpAddressWithSubnetMask(ip, 10).createSubnetMaskIp().toString()).toBe('255.192.0.0');
        expect(new IpAddressWithSubnetMask(ip, 20).createSubnetMaskIp().toString()).toBe('255.255.240.0');
        expect(new IpAddressWithSubnetMask(ip, 30).createSubnetMaskIp().toString()).toBe('255.255.255.252');
        expect(new IpAddressWithSubnetMask(ip, 32).createSubnetMaskIp().toString()).toBe('255.255.255.255');
    });
});