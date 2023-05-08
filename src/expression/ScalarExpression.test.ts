import { asIntN } from '../core/utils';
import ScalarValue from './ScalarValue';

it('parsed from dec string', () => {
    var op = ScalarValue.parse('123');
    expect(op.base).toBe('dec');
    expect(asIntN(op.value)).toBe(123);
});

it('parsed from bin string', () => {
    var op = ScalarValue.parse('0b10');
    expect(op.base).toBe('bin');
    expect(asIntN(op.value)).toBe(2);
});

it('parsed from hex string', () => {
    var op = ScalarValue.parse('0x10');
    expect(op.base).toBe('hex');
    expect(asIntN(op.value)).toBe(16);
});
