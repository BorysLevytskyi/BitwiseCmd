import { Integer } from "./Integer"
import { INT32_MAX_VALUE, UINT32_MAX_VALUE } from "./const";

it('toString for unsigned', () => {
    const s = Integer.unsigned(4294967295).toString(2)
    expect(s).toBe("11111111111111111111111111111111");
});

it('detects size correctly for signed and unsiged version', () => {
    expect(Integer.unsigned(UINT32_MAX_VALUE).maxBitSize).toBe(32);
    expect(Integer.signed(UINT32_MAX_VALUE).maxBitSize).toBe(64);
})

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
});

it('doesnt modify 64-bit number when converting from usinged to signed', () => {
    
    expect(Integer.unsigned(4294967295).toSigned().num()).toBe(-1);
    expect(Integer.unsigned(2147483647).toSigned().num()).toBe(2147483647);    
});


it('converts to largest size', () => {
    const n8 = new Integer(-1, 8);
    const n16 = n8.resize(16);
    const n32 = n16.resize(32);

    expect(n8.num()).toBe(-1);
    expect(n16.num()).toBe(-1);
    expect(n32.num()).toBe(-1);
});