var hash = require('../../src/app/hash').default;

describe('hash arguments parser', function() {

    it('should parse empty', function() {
        var args = hash.getArgs('');
        expect(args).not.toBe(null);
        expect(args).toBeDefined();
        expect(args.commands).toEqual([]);
    });

    it('should parse single command', function() {
       var args = hash.getArgs('#cmd');
        expect(args).not.toBe(null);
        expect(args).toBeDefined();
        expect(args.commands).toEqual(['cmd']);
    });

    it('should parse multiple commands', function() {
        var args = hash.getArgs('#1|2||1^2||~2');
        expect(args).not.toBe(null);
        expect(args).toBeDefined();
        expect(args.commands).toEqual(['1|2', '1^2', '~2']);
    });

    it('should parse multiple commands with clear', function() {
        var args = hash.getArgs('#clear||16,15||16&15');
        expect(args).not.toBe(null);
        expect(args).toBeDefined();
        expect(args.commands).toEqual(['clear', '16 15', '16&15']);
    });

    it('should parse multiple commands encoded', function() {
        var args = hash.getArgs('#' + encodeURI('1|2||1^2||~2||-notrack||-debug'));
        expect(args).not.toBe(null);
        expect(args).toBeDefined();
        expect(args.commands).toEqual(['1|2', '1^2', '~2','-notrack','-debug']);
    });
});