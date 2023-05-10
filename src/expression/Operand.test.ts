import { INT32_MAX_VALUE } from "../core/const";
import Operand from "./Operand";


it('converts numbers to bigint', () => {
    const int32 = new Operand(INT32_MAX_VALUE);
    const int64 = new Operand(BigInt(INT32_MAX_VALUE+1));
    
    expect(int32.value.maxBitSize).toBe(32);
    expect(int64.value.maxBitSize).toBe(64);
});