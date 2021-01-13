import {IpAddress, ipAddressParser, getNetworkClass, InvalidIpAddress} from './ip';


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
        expect(ipAddressParser.parse('256.0.0.0')).toBeInstanceOf(InvalidIpAddress);
        expect(ipAddressParser.parse('0.256.0.0')).toBeInstanceOf(InvalidIpAddress);
        expect(ipAddressParser.parse('0.0.256.0')).toBeInstanceOf(InvalidIpAddress);
        expect(ipAddressParser.parse('0.0.0.256')).toBeInstanceOf(InvalidIpAddress);
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

