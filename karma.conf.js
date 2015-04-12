module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],

        files: [
            'src/js/core/core.js',
            'src/js/core/is.js',
            'src/js/core/di.js',
            'src/js/core/should.js',
            'src/js/core/htmlBuilder.js',
            'src/js/core/should.js',
            'src/js/core/appShell.js',
            'src/js/core/observable.js',
            'src/js/app.js',
            'src/js/components/*.js',
            'src/js/app/**/*.js',
            'tests/unit/**/*.js'
        ]
    });
};
