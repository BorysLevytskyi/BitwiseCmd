export default {
    plainObject: function(obj : any) : boolean {
        return typeof obj == "object" && !(obj instanceof Array) && obj instanceof Object;
    },

    aFunction: function(obj : any) : boolean {
        return typeof obj == "function";
    },

    string: function(obj : any) : boolean {
        return typeof obj == "string";
    },

    array: function(obj : any) : boolean  {
        return obj instanceof Array;
    },

    number: function(obj : any) : boolean  {
        return typeof obj == "number" && !isNaN(obj)
    }
}