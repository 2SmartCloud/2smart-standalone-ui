const webpack                = require('webpack');
const path                   = require('path');
const fs                     = require('fs');
const TerserPlugin           = require('terser-webpack-plugin');
const HtmlWebpackPlugin      = require('html-webpack-plugin');
const CopyWebpackPlugin      = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    mode: 'production',

    entry: {
        app: [
            resolveApp('src/main.js')
        ]
    },

    output: {
        path: resolveApp('build'),
        filename: 'static/[name].[hash:8].js',
        publicPath: '/'
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
                exclude: /(node_modules|normalize.less|\.customize\.less)/,
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
                                require('autoprefixer')()
                            ]
                        }
                    }
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
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(otf|eot|ttf|ttc|woff|jpe?g|png|gif|svg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 24000,
                            name : 'static/media/[name].[hash:8].[ext]'
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            template: resolveApp('public/index.html'),
            templateParameters: (compilation, assets) => ({
                updateConfig:'<script src="/static/updateConfig.js"></script>',
                initBundle: '<script src="/static/initBundle.js"></script>',
                buildFiles: `<script>window.buildJsFiles=[${assets.js.map(js => `'${js}'`).join(',')}];</script>`
            })
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
            }
        }),
        new CopyWebpackPlugin([
            { from: 'public/', ignore: [ '*.html', '.gitkeep' ] }
        ]),
    ],

    optimization: {
        minimizer: [
            new TerserPlugin({
                // i'm not sure whether this would be really helpful
                // due to fact we currently have only 1 cpu core available on our CI server
                parallel: false
            })
        ]
    }
};
