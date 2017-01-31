const path = require('path');

const webpack = require('webpack');

const appId = process.env.ZETKIN_APP_ID || 'a4';

const NODE_ENV = process.env.NODE_ENV || 'development';
const WEBPACK_PORT = process.env.WEBPACK_PORT || 81;

const config = {
    entry: [
        path.join(__dirname, './build/app/client/main')
    ],
    module: {
        loaders: [
            {
                test: /\.eot(\?v=.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.ttf(\?v=.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.woff2?(\?v=.*)?$/,
                loader: 'url-loader?limit=5000'
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
            'process.env.ZETKIN_DOMAIN': JSON.stringify('dev.zetkin.org'),
            'process.env.ZETKIN_APP_ID': JSON.stringify(appId),
        }),
    ],
    output: {
        path: path.join(__dirname, 'build/static'),
        publicPath: '/static/',
        filename: '[name].js'
    },
    node: {
        fs: 'empty',
    },
    externals: [
        {
            './cptable': 'var cptable',
        }
    ]
};

if (NODE_ENV === 'production') {
    config.devtool = '#source-map';

    config.plugins = [
        ...config.plugins,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            mangle: true,
            screw_ie8: true,
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
    ];
} else {
    config.devtool = '#eval-source-map';

    config.entry = [
        ...config.entry,
        'webpack-dev-server/client?http://localhost:' + WEBPACK_PORT,
        'webpack/hot/only-dev-server'
    ];

    config.module.loaders = [
        ...config.module.loaders,
        {
            test: /\.jsx?$/,
            exclude: /\/node_modules\//,
            loaders: [
                'react-hot'
            ]
        },
    ];

    config.plugins = [
        ...config.plugins,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoErrorsPlugin(),
    ];

    config.output.publicPath = 'http://organize.dev.zetkin.org:' + WEBPACK_PORT + '/static/';

    config.devServer = {
        host: '0.0.0.0',
        port: WEBPACK_PORT,
        inline: true,
        hot: true,
        publicPath: config.output.publicPath,
        quiet: false,
        noInfo: false,
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: true,
            chunks: true,
            chunkModules: false
        }
    };
}

module.exports = config;
