var formatter = require('../../src/app/formatter');

describe('expression formatter', function () {

    xit('should format number to binary by default', function() {
        expect(formatter.formatString(10)).toBe("1010");
    });

    xit('should format number hexadecimal', function() {
        expect(formatter.formatString(15, 'hex')).toBe("f");
    });

    xit('should format number decimal', function() {
        expect(formatter.formatString(16, 'dec')).toBe('16');
    });

    xit('should respect padding', function() {
        expect(formatter.padLeft("a", 6)).toBe("00000a");
    });
});