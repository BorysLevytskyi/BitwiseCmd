import hash from './hash';

describe('hash tests', () => {

        it('can decode URL', () => {
            const actual = hash.decodeHash('#4.3.2.1%2F8');
            expect(actual).toBe('4.3.2.1/8');
        });

        it('can get hash from encoded url', () => {
            const actual = hash.getArgs('#-notrack%7C%7C17%2015%7C%7C16&15');
            expect(actual).toMatchObject(["-notrack", "17 15", "16&15"]);
        });

        it('can get hash from unencoded url', () => {
            const actual = hash.getArgs('#1 2|127.0.0.|1&2|192.168.1.1');
            expect(actual).toMatchObject(["1 2|127.0.0.|1&2|192.168.1.1"]);
        });
});