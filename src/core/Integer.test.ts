import { Integer } from "./Integer"

it('converts signed to unsigned and vice versa', () => {
    const n1 = new Integer(-1, 8);
    const n2 = n1.asUnsigned();
    const n3 = n2.asSigned();

    expect(n2.signed).toBe(false);
    expect(n2.num()).toBe(255);

    expect(n3.signed).toBe(true);
    expect(n3.num()).toBe(-1);
});

it('converts to largest size', () => {
    const n8 = new Integer(-1, 8);
    const n16 = n8.resize(16);
    const n32 = n16.resize(32);

    expect(n8.num()).toBe(-1);
    expect(n16.num()).toBe(-1);
    expect(n32.num()).toBe(-1);
});