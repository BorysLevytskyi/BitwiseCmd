import {IpAddress, ipAddressParser} from './ip';

describe('parser tests', () => {
    it('can parse correct ip address', () => {
        const actual = ipAddressParser.parse('127.1.2.3');
        const expected = new IpAddress(127, 1, 2, 3);
        expect(actual?.toString()).toBe(expected.toString());
    });

    it('cannot parse incorrect ip address', () => {
        const parsed = ipAddressParser.parse('1271.0.0.1');
        expect(parsed).toBe(null);
    });
})