(function(app, HtmlBuilder){

    app.service('html', {
        builder: function () {
            return new HtmlBuilder();
        }
    });

})(window.app, window.HtmlBuilder);