// const webpack = require('webpack')

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const compressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
    mode: 'production',
    optimization: {
        emitOnErrors: true,
        minimize: true,
        runtimeChunk: true,
        splitChunks: {
            chunks: 'all',
            minSize: 30000, //大小超过30kb的模块才会被提取
            // maxSize: 1024 * 900,
            automaticNameDelimiter: '.',
            cacheGroups: {
                verdors: {
                    name: "verdors",
                    test: "/node_modules",
                    priority: 1, // 优先级，数值越大，优先级越高
                    minSize: 0, // 小于这个大小的文件，不分割
                    minChunks: 1 // 最少复用几次，这里意思是只要用过一次就分割出来
                },
                commons: {
                    name: "commons",
                    test: /.\/src/,
                    chunks: "initial",
                    minChunks: 2,
                    minSize: 0
                }
            }
        },
        chunkIds: "natural"
        // chunkIds: "named"
    },
    // plugins: [
    //     new BundleAnalyzerPlugin({
    //         analyzerMode: 'static'
    //     }),
    // ],
    stats: {
        // assets: true,
        // assetsSort: 'size',
        timings: true,
        // colors: true,
        colors: {
            green: '\u001b[32m'
        },
        // modules: true,
        // groupModulesByType: true,
        // builtAt: true,
        // entrypoints: true,
        // chunks: true,
        // chunksSort: 'name',
        // preset: 'verbose'


    },
    plugins: [
        new compressionWebpackPlugin()
    ]
}
