export default {
    encodeHash: function(input:string):string {
        return encodeURIComponent(input.trim().replace(/\s/g,','));
    },
    decodeHash: function(hashValue:string):string {
        return decodeURIComponent(hashValue.replace(/^\#/, '')).replace(/,/g,' ');
    },
    getArgs: function (hashValue:string) : string[] {

        var decodedHash = this.decodeHash(hashValue);
        var args : string[] = [];

        splitHashList(decodedHash).forEach(function(value) {
            args.push(value);
        });

        return args;
    }
};

function splitHashList(str: string) : string[] {

    return str.split('||').filter(s => s.length > 0);
}