const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

let distPath = path.resolve(__dirname, 'dist');

const mode = process.env.NODE_ENV || 'development';

const devMode = mode === 'development';

const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;


const pages = fs.readdirSync(path.resolve(__dirname, 'src', 'html')).filter(item => /\./u.test(item));
const styles = fs.readdirSync(path.resolve(__dirname, 'src', 'scss')).filter(item => /\./u.test(item));

module.exports = {
    mode,
    target,
    devtool,
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'main.js')],
    output: {
        path: distPath,
        clean: true,
        filename: 'main.js',
    },
    optimization: {
        minimizer: [
          new CssMinimizerPlugin(),
        ],
    },
    plugins: [   
        ...pages.map(item => {
            return new HtmlWebpackPlugin({
                filename: item.replace(/kit/u, 'html'),
                template: path.resolve(__dirname, 'src', 'html', item)
            })
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.scss$/,
                use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [require('postcss-preset-env')],
                                    minimize: !devMode

                                },
                            }
                        },
                        "sass-loader"
                ],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                generator: {
                    filename: '[name][ext]'
                },
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [[
                        '@babel/preset-env',
                    ]],
                    minified: !devMode
                  }
                }
            },
            {
                test: /\.(woff2?|eot|otf|svg|ttf)$/,
                exclude: /(img)/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.(jpe?g|png|webp|gif|svg)$/,
                exclude: /(fonts)/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]'
                }
            }
        ]
    },
    devServer: {
        open: true,
        hot: false,
    },
}