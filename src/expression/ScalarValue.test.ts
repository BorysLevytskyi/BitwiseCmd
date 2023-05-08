import { INT32_MAX_VALUE } from "../core/const";
import ScalarValue from "./ScalarValue";


it('converts numbers to bigint', () => {
    const int32 = new ScalarValue(INT32_MAX_VALUE);
    const int64 = new ScalarValue(BigInt(INT32_MAX_VALUE+1));
    
    expect(int32.maxBitSize).toBe(32);
    expect(int64.maxBitSize).toBe(64);
});