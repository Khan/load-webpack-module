const path = require("path");
const ModuleChunkDepsPlugin = require("./module-chunk-deps-plugin.js");

module.exports = {
    mode: "development",
    target: "web",
    entry: {
        "index": "./src/index.js",
        "sandbox": "./src/sandbox.js",
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
        new ModuleChunkDepsPlugin(),
    ],
    devtool: "source-map",
};
