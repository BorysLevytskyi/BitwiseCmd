(function(app, core){
    "use strict";

    app.set('html', core.html);
    app.set('is', core.is);
    app.set('should', core.should);
    app.set('bindr', core.bindr);

    app.set('hash', function () {
        return {
            encodeHash: function(string) {
                return encodeURI(string.trim()).replace(/\s/g,',');
            },
            decodeHash: function(hashValue) {
                return decodeURI(hashValue).replace(/^\#/, '').replace(/,/g,' ');
            }
        }
    })

})(window.app, window.core);