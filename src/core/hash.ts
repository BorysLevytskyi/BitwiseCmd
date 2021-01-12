export default {
    encodeHash: function(input:string):string {
        return encodeURI(input.trim().replace(/\s/g,','));
    },
    decodeHash: function(hashValue:string):string {
        return decodeURI(hashValue).replace(/^\#/, '').replace(/,/g,' ');
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
    var values = [];

    if(str.indexOf('||')) {
    str.split('||').forEach(function (v) {
        if (v.length > 0) {
            values.push(v);
        }
    });
    } else {
        values.push(str);
    }

    return values;
}