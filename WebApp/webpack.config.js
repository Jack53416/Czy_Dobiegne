const webpack = require("webpack");
const path = require("path");

module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        })
    ],
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devServer: {
        historyApiFallback: true
    },
    module: {
        loaders: [
            { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader' },
            {
                test: /\.(eot|ttf|wav|mp3)$/,
                loader: 'file-loader'
            },
            { test: /\.css$/, loader: "style!css" },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    babelrc: false,
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};