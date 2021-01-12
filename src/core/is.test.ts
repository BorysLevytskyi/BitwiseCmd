import is from "./is";

describe("is", () => {

    it("can detect array", () => {
        expect(is.array([1,2,3])).toBe(true);
        expect(is.array({})).toBe(false);
        expect(is.array("123")).toBe(false);
    });

    it("can detect plain object", () => {
        expect(is.plainObject({})).toBe(true);
        expect(is.plainObject([1,2,3])).toBe(false);        
        expect(is.plainObject("123")).toBe(false);
    });
});