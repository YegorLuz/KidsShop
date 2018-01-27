const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const DEVELOPMENT = 'development';
const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].css",
    disable: NODE_ENV === DEVELOPMENT
});

module.exports = {
    entry: {
        index: './client/pages/main/index.js',
        product: './client/pages/product/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'stage-3']
                }
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.jpg$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            }
        ]
    },
    plugins: NODE_ENV === DEVELOPMENT ? [
        new HtmlWebpackPlugin({
            inject: false,
            chunks: ['index'],
            filename: 'index.html',
            template: 'client/pages/main/index.html'
        }),
        new HtmlWebpackPlugin({
            inject: false,
            chunks: ['product'],
            filename: 'product.html',
            template: 'client/pages/product/index.html'
        }),
        new ExtractTextPlugin('styles.css')
    ] : [
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: true
            },
            mangle: {
                except: ['$'],
                screw_ie8 : true,
                keep_fnames: true
            },
            sourceMap: false
        }),
        new HtmlWebpackPlugin({
            inject: false,
            chunks: ['index'],
            filename: 'index.html',
            template: 'client/pages/main/index.html'
        }),
        new HtmlWebpackPlugin({
            inject: false,
            chunks: ['product'],
            filename: 'product.html',
            template: 'client/pages/product/index.html'
        }),
        extractSass
    ]
};