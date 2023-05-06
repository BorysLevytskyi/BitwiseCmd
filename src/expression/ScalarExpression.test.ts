import ScalarExpression from './ScalarExpression';

it('parsed from string', () => {
    var op = ScalarExpression.parse('123');
    expect(op.base).toBe('dec');
    expect(op.value).toBe(123);
});

it('can get other kind', () => {
    var op = new ScalarExpression(10, 'dec');
    expect(op.getOtherBase('hex')).toBe('dec');
    expect(op.getOtherBase('bin')).toBe('hex');    
});

it('negtive value binary string', () => {
    expect(ScalarExpression.toBaseString(-1, 'bin')).toBe('11111111111111111111111111111111');
});

it('64 bit operand binary string', () => {
    expect(ScalarExpression.toBaseString(68719476735, 'bin')).toBe('111111111111111111111111111111111111');
});
