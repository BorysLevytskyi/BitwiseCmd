import formatter from './formatter';

describe("formatter", () => {
    it('formats string', () => {
        expect(formatter.formatString(15, "dec")).toBe("15");
        expect(formatter.formatString(15, "hex")).toBe("f");
        expect(formatter.formatString(15, "bin")).toBe("1111");
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