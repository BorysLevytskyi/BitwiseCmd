import { Integer } from "./Integer"
import { UINT32_MAX_VALUE } from "./const";

it('converts signed to unsigned and vice versa', () => {
    const n1 = new Integer(-1, 8);
    const n2 = n1.toUnsigned();
    const n3 = n2.toSigned();

    expect(n2.signed).toBe(false);
    expect(n2.num()).toBe(255);

    expect(n3.signed).toBe(true);
    expect(n3.num()).toBe(-1);

    expect(new Integer(1, 32, false).resize(64).toSigned().maxBitSize).toBe(64);
});

it('convers to different type', () => {
    const src = new Integer(-1);
    const dest = new Integer(1, 64, false);

    const n = src.convertTo(dest);
    expect(n.num()).toBe(UINT32_MAX_VALUE);
})

it('converts to largest size', () => {
    const n8 = new Integer(-1, 8);
    const n16 = n8.resize(16);
    const n32 = n16.resize(32);

    expect(n8.num()).toBe(-1);
    expect(n16.num()).toBe(-1);
    expect(n32.num()).toBe(-1);
});