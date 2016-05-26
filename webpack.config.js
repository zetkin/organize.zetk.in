var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        path.join(__dirname, 'dist/organize.zetk.in/client/main.js')
    ],
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': process.env.NODE_ENV,
            'process.env.GA_TRACKING_ID': '"UA-75118791-1"',
        }),
    ],
    output: {
        path: path.join(__dirname, 'dist/static/js'),
        publicPath: 'http://organize.zetkin/',
        filename: '[name].js'
    },
    node: {
        fs: 'empty',
    }
};
