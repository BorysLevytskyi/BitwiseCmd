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
});