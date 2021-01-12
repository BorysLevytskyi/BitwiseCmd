import NumericOperand from './NumericOperand';

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