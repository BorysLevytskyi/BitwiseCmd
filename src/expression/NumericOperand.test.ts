import NumericOperand, { INT_MAX_VALUE } from './NumericOperand';

it('parsed from string', () => {
    var op = NumericOperand.parse('123');
    expect(op.base).toBe('dec');
    expect(op.value).toBe(123);
});

it('can get other kind', () => {
    var op = new NumericOperand(10, 'dec');
    expect(op.getOtherBase('hex')).toBe('dec');
    expect(op.getOtherBase('bin')).toBe('hex');    
});

it('negtive value binary string', () => {
    expect(NumericOperand.toBaseString(-1, 'bin')).toBe('11111111111111111111111111111111');
});

it('64 bit operand binary string', () => {
    expect(NumericOperand.toBaseString(68719476735, 'bin')).toBe('111111111111111111111111111111111111');
});

it('throws on negative 64 bit numbers', () => {
    var bigN = -(INT_MAX_VALUE+1);
    expect(() => new NumericOperand(bigN)).toThrowError("BitwiseCmd currently doesn't support 64 bit negative numbers such as " + bigN);
})