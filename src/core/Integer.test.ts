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