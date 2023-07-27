const webpack           = require('webpack');
const path              = require('path');
const fs                = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const wbpClient = process.env.DOCKER === 'true' ?
    'webpack-dev-server/client?https://0.0.0.0' : 'webpack-dev-server/client?http://0.0.0.0:3000';
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    mode: 'development',

    devtool: 'eval-source-map',

    entry: [
        'react-hot-loader/patch',
        wbpClient,
        'webpack/hot/only-dev-server',
        resolveApp('src/main.js')
    ],

    output: {
        path      : resolveApp('build'),
        filename  : 'static/build.js',
        publicPath: '/'
    },

    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'eslint-loader',
                        options: {
                            emitWarning: true
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                exclude: /(node_modules|normalize\.less|\.customize\.less)/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: {
                                localIdentName: '[path][name]__[local]--[hash:base64:5]'
                            }
                        }
                    },
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('stylelint')(),
                                require('autoprefixer')()
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /normalize\.less/,
                use : [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            },
            {
                test: /\.customize\.less/,
                use : [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            },
            {
                test: /\.(otf|eot|ttf|ttc|woff|jpe?g|png|gif|svg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 24000
                        }

                    }
                ]
            },
            {
                test: /\.md$/,
                use: 'raw-loader'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: resolveApp('public/index.html'),
            templateParameters: () => ({
                updateConfig:'',
                buildFiles: '',
                initBundle: ''
            })
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ],

    optimization: {
        namedModules: true  //NamedModulesPlugin()
    }
};
