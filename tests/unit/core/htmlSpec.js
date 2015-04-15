describe('html templates', function () {
    var html = core.html;

    it('should compile template', function() {
        var t = "<div>{m.name}</div>";
        var compiled = html.compileTemplate(t);
        expect(typeof compiled).toBe("function");
        expect(compiled({name: 'test'})).toBe('<div>test</div>');
    });

    it('should support each', function () {
        var t = '{each n in m.lst}{each c in m.lst2}{n}{c}{/}{/}';
        var compiled = html.compileTemplate(t);
        var result = compiled({lst:[1,2,3], lst2:['a','b']});
        console.log(result);
        expect(result).toBe('1a1b2a2b3a3b');
    });
});