(function(app, core){
    "use strict";

    app.set('html', core.HtmlBuilder);
    app.set('is', core.is);
    app.set('should', core.should);
    app.set('bindr', core.bindr);

})(window.app, window.core);