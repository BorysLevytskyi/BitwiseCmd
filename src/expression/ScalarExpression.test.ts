import ScalarToken from './ScalarToken';

it('parsed from dec string', () => {
    var op = ScalarToken.parse('123');
    expect(op.base).toBe('dec');
    expect(op.value).toBe(123);
});

it('parsed from bin string', () => {
    var op = ScalarToken.parse('0b10');
    expect(op.base).toBe('bin');
    expect(op.value).toBe(2);
});

it('parsed from hex string', () => {
    var op = ScalarToken.parse('0x10');
    expect(op.base).toBe('hex');
    expect(op.value).toBe(16);
});
