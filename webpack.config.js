const path = require("path");
const ModuleChunkDepsPlugin = require("./module-chunk-deps-plugin.js");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    target: "web",
    entry: {
        "index": "./src/app-entry.js",
        "sandbox": "./src/sandbox-entry.js",
    },
    stats: {
        source: false,
    },
    output: {
        publicPath: "/dist/",
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist"),
        pathinfo: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            maxAsyncRequests: Infinity,
            minSize: 0,
            minChunks: 1,
        },
        // without this setting, __webpack_chunk_load__ will not be defined in modules
        runtimeChunk: {
            name: "runtime",
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Index',
            chunks: ['runtime', 'vendors~index~sandbox', 'vendors~index', 'vendors~fixtures-foo~index', 'fixtures-foo~index', 'index~sandbox', 'index'],
            inject: 'body',
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Sandbox',
            chunks: ['runtime', 'vendors~index~sandbox', 'index~sandbox', 'sandbox'],
            inject: 'body',
            filename: 'sandbox.html'
        }),
        new ModuleChunkDepsPlugin(),
    ],
    devtool: "source-map",
};
