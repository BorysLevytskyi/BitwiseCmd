describe('expression formatter', function () {
    var di = app.di.clone();
    var formatter = di.resolve('formatter');

    it('should format number to binary by default', function() {
        expect(formatter.formatString(10)).toBe("1010");
    });

    it('should format number hexadecimal', function() {
        expect(formatter.formatString(15, 'hex')).toBe("f");
    });

    it('should format number decimal', function() {
        expect(formatter.formatString(16, 'dec')).toBe('16');
    });

    it('should respect padding', function() {
        expect(formatter.padLeft("a", 6)).toBe("00000a");
    });
});