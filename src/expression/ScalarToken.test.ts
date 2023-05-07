import { faL } from "@fortawesome/free-solid-svg-icons";
import ScalarToken from "./ScalarToken";
import exp from "constants";


it('supports bigint', () => {
    const int = new ScalarToken(1);
    const bigint = new ScalarToken(BigInt(1));
    expect(int.isBigInt()).toBe(false);
    expect(bigint.isBigInt()).toBe(true);
    expect(int.bitSize()).toBe(32);
    expect(bigint.bitSize()).toBe(64);
});