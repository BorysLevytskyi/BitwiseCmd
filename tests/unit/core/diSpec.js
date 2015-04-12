describe("cloned container", function() {
    var objA = { id: "a"};
    var objB = { id: "b" };
    var objC = { id: 'c'};

    var parent = new core.Container();

    parent.register('a', objA);
    parent.register('b', objB);

    var cloned = parent.clone();
    cloned.register('a', objC);

    it("should be independent from source container", function() {
        expect(parent.resolve('a')).toBe(objA);
        expect(cloned.resolve('a')).toBe(objC);
        expect(parent.resolve('b')).toBe(objB);
        expect(cloned.resolve('b')).toBe(objB);
    });
});