module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],

        files: [
            'src.old/js/core/core.js',
            'src.old/js/core/is.js',
            'src.old/js/core/di.js',
            'src.old/js/core/should.js',
            'src.old/js/core/htmlBuilder.js',
            'src.old/js/core/should.js',
            'src.old/js/core/appShell.js',
            'src.old/js/core/observable.js',
            'src.old/js/app.js',
            'src.old/js/components/*.js',
            'src.old/js/app/**/*.js',
            'tests/unit/**/*.js'
        ]
    });
};
