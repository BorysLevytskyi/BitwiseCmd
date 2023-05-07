import ScalarValue from "./ScalarValue";


it('supports bigint', () => {
    const int = new ScalarValue(1);
    const bigint = new ScalarValue(BigInt(1));
    expect(int.isBigInt()).toBe(false);
    expect(bigint.isBigInt()).toBe(true);
    expect(int.bitSize()).toBe(32);
    expect(bigint.bitSize()).toBe(64);
});