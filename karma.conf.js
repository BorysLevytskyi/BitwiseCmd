module.exports = function (config) {
  config.set({
    browsers: [ 'Chrome' ],
    // karma only needs to know about the test bundle
    files: [
      './tests/unit/**/*.js'
    ],
    frameworks: [ 'jasmine' ],
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-webpack',
    ],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      './tests/unit/**/*.js': [ 'webpack']
    },
    reporters: [ 'dots' ],
    singleRun: true,
    // webpack config object
    webpack: {
      module: {
        loaders: [
          {
            exclude: /node_modules/,
            loader: 'babel-loader',
            test: /\.jsx?$/,
            query: {
                presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-react')],
                plugins: [require.resolve('babel-plugin-transform-class-properties')]
            },
          }
        ],
      }
    },
    webpackMiddleware: {
      noInfo: true,
    }
  });
};