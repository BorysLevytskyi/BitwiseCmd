import { faL } from "@fortawesome/free-solid-svg-icons";
import ScalarToken from "./ScalarToken";

it('creates limited to 32 bit', () => {
    expect(new ScalarToken(-1).is32BitLimit).toBe(false);
    expect(new ScalarToken(-1, 'dec', true).is32BitLimit).toBe(true);
    expect(new ScalarToken(1,  'dec', true).is32BitLimit).toBe(true);
});

it('supports bigint', () => {
    const int = new ScalarToken(1);
    const bigint = new ScalarToken(BigInt(1));
    expect(int.isBigInt()).toBe(false);
    expect(bigint.isBigInt()).toBe(true);
});