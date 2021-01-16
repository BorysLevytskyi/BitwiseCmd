import ipAddressParser, { ParsedIpObject, ParsingError } from './ip-parser';
import { IpAddressWithSubnetMask, IpAddress, SubnetCommand } from "./models";


describe('parser tests', () => {
    it('can parse correct ip address', () => {
        const actual = ipAddressParser.parse('127.1.2.3');
        expect(actual).not.toBe(null);
        expect(actual).not.toBeInstanceOf(ParsingError);

        const obj = (actual as ParsedIpObject[])[0];
        const expected = new IpAddress(127, 1, 2, 3);
        expect(obj).not.toBe(null);
        expect(obj.toString()).toBe(expected.toString());
    });

    it('cannot parse incorrect ip address', () => {
        expect(ipAddressParser.parse('abc')).toBe(null);
        expect(ipAddressParser.parse('')).toBe(null);
    });

    it('should parse invalid ip address', () => {
        expect(ipAddressParser.parse('256.0.0.0')).toBeInstanceOf(ParsingError);
        expect(ipAddressParser.parse('0.256.0.0')).toBeInstanceOf(ParsingError);
        expect(ipAddressParser.parse('0.0.256.0')).toBeInstanceOf(ParsingError);
        expect(ipAddressParser.parse('0.0.0.256')).toBeInstanceOf(ParsingError);
        expect(ipAddressParser.parse('0.0.0.255 asd')).toBeInstanceOf(ParsingError);
        expect(ipAddressParser.parse('0.0.0.255/99')).toBeInstanceOf(ParsingError);
    });

    it('parses correct ip and subnet mask', () => {
        const actual = ipAddressParser.parse('127.0.0.1/24');
        
        expect(actual).not.toBe(null);
        expect(actual).not.toBeInstanceOf(ParsingError);

        const obj = (actual as ParsedIpObject[])[0];
        expect(obj).toBeInstanceOf(IpAddressWithSubnetMask);
        expect(obj!.toString()).toBe('127.0.0.1/24');
        expect((obj as IpAddressWithSubnetMask).maskBits).toBe(24);
    });

    it('parses list of ip addresses', () => {
        const actual = ipAddressParser.parse('127.0.0.1/24 255.255.1.1');
        
        expect(actual).not.toBe(null);
        expect(actual).not.toBeInstanceOf(ParsingError);

        const first = (actual as ParsedIpObject[])[0];
        expect(first).toBeInstanceOf(IpAddressWithSubnetMask);
        expect(first!.toString()).toBe('127.0.0.1/24');
        expect((first as IpAddressWithSubnetMask).maskBits).toBe(24);

        const second = (actual as ParsedIpObject[])[1];
        expect(second).toBeInstanceOf(IpAddress);
        expect(second!.toString()).toBe('255.255.1.1');
    });

    it('parses subnet command', () => {
        const actual = ipAddressParser.parse('subnet 192.168.1.1/23');
        expect(actual).toBeInstanceOf(SubnetCommand);
        const subnet = actual as SubnetCommand;
        expect(subnet.toString()).toBe('192.168.1.1/23');
    });
});