import ScalarToken from "./ScalarToken";

it('creates limited to 32 bit', () => {
    expect(new ScalarToken(-1).is32BitLimit).toBe(false);
    expect(new ScalarToken(-1, 'dec', true).is32BitLimit).toBe(true);
    expect(new ScalarToken(1,  'dec', true).is32BitLimit).toBe(true);
});