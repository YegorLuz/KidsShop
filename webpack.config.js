const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
        filename: 'js/[name].js',
        sourceMapFilename: '[file].map',
    },
    devtool: NODE_ENV === DEVELOPMENT ? 'inline-source-map' : false,
    devServer: {
        publicPath: "/",
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
        hot: true,
        inline: true,
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
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: function () {
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        'resolve-url-loader',
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.svg$/i,
                loader: 'file-loader',
                options: {
                    name: 'css/icons/[name].[ext]',
                    context: path.resolve(__dirname, 'dist/css'),
                    publicPath: '../'
                }
            },
            {
                test: /\.(otf|ttf|eot)$/i,
                loader: 'file-loader',
                options: {
                    name: 'css/fonts/[name].[ext]',
                    context: path.resolve(__dirname, 'dist/css'),
                    publicPath: '../'
                }
            },
            {
                test: /\.woff(2)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                    name: 'css/fonts/[name].[ext]',
                    context: path.resolve(__dirname, 'dist/css'),
                    publicPath: '../'
                }
            }
        ]
    },
    plugins: NODE_ENV === DEVELOPMENT ? [
        new CleanWebpackPlugin(['dist']),
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
        new ExtractTextPlugin('styles.css'),
        new webpack.HotModuleReplacementPlugin()
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