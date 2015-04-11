describe('html templates', function () {
    var html = core.html;

    it('should compile template', function() {
        var t = "<div>{m.name}</div>";
        var compiled = html.compileTemplate(t);
        expect(typeof compiled).toBe("function");
        expect(compiled({name: 'test'})).toBe('<div>test</div>');
    });
});