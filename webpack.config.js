module.exports = {
    entry: __dirname + "/src/app/index.jsx",
    output: {
        fileame: 'bundle.js',
        path: __dirname + '/src',
        publicPath: 'http://localhost:8080/'
    },
    devtool: 'source-maps',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: /node-modules/,
            output: { path: __dirname + '/src', filename: 'bundle.js' },
            query: {
                presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-react')],
                plugins: [require.resolve('babel-plugin-transform-class-properties')]
            },
        }]
    },
    // externals: {
    //     //don't bundle the 'react' npm package with our bundle.js
    //     //but get it from a global 'React' variable
    //     'react': 'React'
    // },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};