export default {
        plainObject: function(obj) {
            return typeof obj == "object" && obj instanceof Object;
        },

        aFunction: function (obj) {
            return typeof obj == "function";
        },

        string: function (obj) {
            return typeof obj == "string";
        },

        regex: function (obj) {
            return typeof obj == "object" && this.constructedFrom(RegExp);
        },

        constructedFrom: function (obj, ctor) {
            return obj instanceof ctor;
        },

        htmlElement: function(obj) {
            return obj instanceof HtmlElement;
        },

        array: function(obj) {
            return obj instanceof Array;
        },

        number: function(num) {
            return typeof num == "number" && !isNaN(num)
        }
}