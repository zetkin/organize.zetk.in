const path = require('path');

const webpack = require('webpack');

const APP_ID = process.env.ZETKIN_APP_ID || 'a3';
const USE_TLS = process.env.ZETKIN_USE_TLS || 0;
const DOMAIN = process.env.ZETKIN_DOMAIN;

const NODE_ENV = process.env.NODE_ENV || 'development';
const WEBPACK_HOST = process.env.WEBPACK_HOST || 'organize.dev.zetkin.org';
const WEBPACK_PORT = parseInt(process.env.WEBPACK_PORT) || 81;

const config = {
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 500,
    },
    entry: [
        path.join(__dirname, 'src/client/main'),
    ],
    resolve: {
        extensions: [
            '.js',
            '.jsx',
        ],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'src'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            plugins: [
                                'transform-decorators-legacy',
                            ],
                            presets: [
                                ['env', {
                                    targets: {
                                        browsers: false,
                                    },
                                    modules: false,
                                }],
                                'stage-1',
                                'react',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                include: path.join(__dirname, 'node_modules'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: [
                                ['env', {
                                    targets: {
                                        browsers: true,
                                    },
                                    modules: false,
                                }],
                            ],
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
            'process.env.ZETKIN_DOMAIN': JSON.stringify(DOMAIN),
            'process.env.ZETKIN_APP_ID': JSON.stringify(APP_ID),
            'process.env.ZETKIN_USE_TLS': JSON.stringify(USE_TLS),
        }),
        new webpack.NoEmitOnErrorsPlugin(),
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
            '../xlsx.js': 'var _XLSX',
            './cptable': 'var cptable',
        }
    ]
};

if (NODE_ENV === 'production') {
    config.devtool = '#source-map';

    config.plugins = [
        ...config.plugins,
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            sourceMap: true,
        }),
    ];
} else {
    config.devtool = '#eval-source-map';

    config.entry = [
        ...config.entry,
        `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
        'webpack/hot/only-dev-server',
    ];

    config.module.rules[0].use[0].options.presets[0][1].modules = 'commonjs';
    config.module.rules[0].use.unshift({
        loader: 'react-hot-loader',
    });

    config.plugins = [
        ...config.plugins,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ];

    config.output.publicPath = `http://${WEBPACK_HOST}:${WEBPACK_PORT}/static/`;

    config.devServer = {
        host: '0.0.0.0',
        port: WEBPACK_PORT,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
        inline: true,
        hot: true,
        public: `${WEBPACK_HOST}:${WEBPACK_PORT}`,
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
