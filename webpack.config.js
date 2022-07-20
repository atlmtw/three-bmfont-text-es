const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: 'index.js',
        library: {
            name: 'three-bmfont-text',
            type: 'umd'
        },
        clean: true,
    },
    externals: {
        three: 'three'
    },
    // resolve: {
    //     extensions: ['.webpack.js', '.js']
    // },
    // devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
              test: /\.(js)$/,
              exclude: /node_modules/,
              use: "babel-loader",
            },
        ],
    }
};