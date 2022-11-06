const path = require('path')
const resolve = path.resolve
const appCode = 'home'
// const scssPath = path.join(__dirname, '../src', 'common', 'scss')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')
const env = process.env.NODE_ENV || 'development'
const dotenv = require('dotenv')
const _env = dotenv.config({
    path: resolve(__dirname, `../.env.${env === 'development' ? 'development' : 'production'}`)
}).parsed
const envConfig = (function () {
    return Object.assign({}, Object.keys(_env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(_env[next])
        prev[`${next}`] = JSON.stringify(_env[next])
        return prev
    }, {}), {
        // 'process.env.NODE_ENV': JSON.stringify(`${env}`),
        'NODE_ENV': JSON.stringify(`${env}`),
        '__VUE_OPTIONS_API__': true,
        '__VUE_PROD_DEVTOOLS__': false
    })
}())

// console.log(envConfig)

module.exports = (enviroment, { mode }) => {
    const config = {
        entry: resolve(__dirname, '../src/main.ts'),
        output: {
            publicPath: _env.VUE_APP_PUBLIC_PATH,
            // path: _env.VUE_APP_OUTPUT_DIR,
            path: resolve(__dirname, '../', _env.VUE_APP_OUTPUT_DIR),
            library: {
                // 微应用的包名，这里与主应用中注册的微应用名称一致
                name: `${appCode}-[name]`,
                // // 将你的 library 暴露为所有的模块定义下都可运行的方式
                type: 'umd'
            },
            // 按需加载相关，设置为 webpackJsonp_包名 即可
            chunkLoadingGlobal: `webpackJsonp_${appCode}`,
            filename: 'js/[name].[contenthash].bundle.js',
            assetModuleFilename: 'images/[hash][ext][query]',
            // 在生成文件之前清空 output 目录
            clean: true
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.vue'],
            // 模块别名
            // config.resolve.alias.set('@', resolve('src')).set('@assets', resolve('src/assets')).set('@components', resolve('src/components'))
            alias: {
                '@': resolve(__dirname, '../src'),
                '_WEB': resolve(__dirname, '../src/pages/web'),
                'cbim-render-ui': resolve(__dirname, '../node_modules/cbim-render-ui-test'),
                // 'webpack-dev-server': resolve(__dirname, '../third-party/webpack-dev-server')
            },
            // fallback: {
            //     process: require.resolve('process/browser'),
            // }
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|wav|svg|webp)$/,
                    type: 'javascript/auto',
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                name: "[name].[hash:16].[ext]",
                                limit: 1024 * 14,
                                outputPath: "assets/img", // 为你的文件配置自定义 output 输出目录 ; 用来处理图片路径问题
                                // publicPath: "assets/imgs", // 为你的文件配置自定义 public 发布目录 ; 用来处理图片路径问题
                                esModule: false,
                            }
                        }
                    ]
                },
                {
                    test: /\.(eot|ttf|woff2?|otf|svgz)$/,
                    type: 'asset/inline'
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [path.resolve(__dirname, '../src')],
                    exclude: [path.resolve(__dirname, '../node_modules')]
                },
                {
                    test: /\.m?js$/,
                    resolve: {
                        fullySpecified: false,
                    }
                },
                {
                    test: /\.tsx?$/,
                    exclude: /$\/node_modules/,
                    use: [
                        {
                            loader: 'babel-loader'
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: false,
                                appendTsSuffixTo: ['\\.vue$'],
                            }
                        }
                    ]
                },
                {
                    test: /\.(s*)css$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        // {loader: 'style-loader'},
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' },
                        {
                            loader: "sass-loader",
                            options: {
                                // Prefer `dart-sass`
                                implementation: require("sass"),
                            },
                        },
                        // {
                        //     loader: 'sass-resources-loader',
                        //     options: {
                        //         resources: [`${scssPath}/color.scss`]
                        //     }
                        // }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        // {loader: 'style-loader'},a
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' },
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            less: [
                                'vue-style-loader',
                                'css-loader',
                                'less-loader'
                            ],
                            scss: [
                                'vue-style-loader',
                                'css-loader',
                                {
                                    loader: "sass-loader",
                                    options: {
                                        // Prefer `dart-sass`
                                        implementation: require("sass"),
                                    },
                                },
                                // {
                                //     loader: 'sass-resources-loader',
                                //     options: {
                                //         resources: [`${scssPath}/color.scss`]
                                //     }
                                // }
                            ]
                        }
                    }
                },
                {
                    test: /\.worker\.js$/,
                    use: { loader: 'worker-loader' }
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                dry: true,
                verbose: true
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new webpack.DefinePlugin(envConfig),
            new HtmlWebpackPlugin({
                filename: mode === 'development' ? `index.html` : '../templates/index.html',
                template: resolve(__dirname, '../public/index.html'),
                inject: 'body',
                // favicon: './favicon.ico',
                hash: true,
                // chunks: ['vendors', `vendors.${PACKAGE_NAME}`, 'commons', PACKAGE_NAME]
            }),
            new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash].css",
                chunkFilename: "css/[name].[contenthash].css"
            }),
            new VueLoaderPlugin(),
            // new CopyWebpackPlugin({
            //     patterns: [
            //         { from: path.resolve(__dirname, '../static'), to: path.resolve(__dirname, '../dist/static') }
            //     ]
            // })
        ]
    }
    // console.log('>>> config:', config)
    // return smp.wrap(merge(config, require(`./webpack.config.${mode === 'development' ? 'development' : 'production'}`)))
    return merge(config, require(`./webpack.config.${mode === 'development' ? 'development' : 'production'}`))
}
