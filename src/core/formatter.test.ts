import formatter from './formatter';

describe("formatter", () => {
    it('formats string', () => {
        expect(formatter.numberToString(15, "dec")).toBe("15");
        expect(formatter.numberToString(15, "hex")).toBe("0xf");
        expect(formatter.numberToString(15, "bin")).toBe("1111");
    });

    it('formats large binary number correctly', () => {
        var decimal = 68719476735;
        var binary = formatter.bin(68719476735);
        var hex = formatter.numberToString(decimal, 'hex');
        expect(binary).toBe('111111111111111111111111111111111111');
        expect(hex).toBe('0xfffffffff');
    });

    it('formats negative binary numbers', () => {
        //expect(formatter.numberToString(-1, 'bin')).toBe("11111111111111111111111111111111");
        //expect(formatter.numberToString(-0, 'bin')).toBe("0");
        expect(formatter.numberToString(-2147483647, 'bin')).toBe("10000000000000000000000000000001");       
    });

    it('pads left', () => {
        expect(formatter.padLeft("1", 3, " ")).toBe("  1");
    });

    it('splits ip address by mask', () => {
        const ip = "11000000.10101000.00000001.00000001";
        expect(formatter.splitByMasks(ip, 2, 3)).toEqual({vpc:"11", subnet:"0", hosts:"00000.10101000.00000001.00000001"});
        expect(formatter.splitByMasks(ip, 8, 16)).toEqual({vpc:"11000000", subnet:".10101000", hosts:".00000001.00000001"});
        expect(formatter.splitByMasks(ip, 8, 22)).toEqual({vpc:"11000000", subnet:".10101000.000000", hosts:"01.00000001"});
    })
});