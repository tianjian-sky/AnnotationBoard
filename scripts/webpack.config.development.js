const webpack = require('webpack')
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const char = process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    optimization: {
        emitOnErrors: true,
        chunkIds: "named"
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'vue']
        }),
        new webpack.ProgressPlugin({
            // activeModules: false,
            // entries: true,
            handler(percentage, message, ...args) {
                process.stdout.write(char)
                // process.stdout.write('\033c')
                console.info(`${percentage.toFixed(2) * 100}%`, message, ...args);
            },
            // modules: true,
            // modulesCount: 5000,
            // profile: false,
            // dependencies: true,
            // dependenciesCount: 10000,
            percentBy: 'entries',
        })
    ],
    devServer: {
        host: 'localhost',
        port: 8084,
        static: {
            directory: path.resolve(__dirname, '../dist/')
        },
        hot: true,
        compress: true,
        historyApiFallback: true,
        open: false,
        client: {
            overlay: true,
            logging: 'info',
            progress: true
        },
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }
            devServer.app.use(function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000')
                res.setHeader('Access-Control-Allow-Credentials', 'true')
                res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE')
                res.setHeader(
                    'Access-Control-Allow-Headers',
                    'cityid,session,cbim-cityid,entid,env,accountid,appcode,applicationname,sessionkey,session-key,cbim-projectid,cbim-accountid,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,XRequested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization'
                )
                if (req.method.toLowerCase() === 'options') {
                    return res.writeHeader(204).end()
                }
                next()
            })
            return middlewares
        },
        proxy: {
            '/writting': {
                target: 'https://webapi.xfyun.cn/',
                pathRewrite: { '^/writting': '/' },
                changeOrigin: true,
                secure: false
            },
            '/bmsApi/api': {
                target: 'https://dev.cbim.org.cn',
                changeOrigin: true,
                secure: true,
                pathRewrite: {
                    '/bmsApi': ''
                }
            },
            '/api/taskApi': {
                // test
                // target: 'https://knowledge-testwh.cbim.org.cn/api/frontend',
                // dev
                target: 'https://dev-gw.cbim.org.cn/cbim-task',
                // target: 'http://10.81.1.38:8089', // 周礼双
                // target: 'http://10.81.1.17:8089', // zhangchi
                changeOrigin: true,
                secure: true,
                logLevel: 'debug',
                pathRewrite: {
                    '/api/taskApi': ''
                }
            },
            '/api/resourceApi': {
                // test
                // target: 'https://knowledge-testwh.cbim.org.cn/api/frontend',
                // dev
                target: 'https://knowledge-devwh.cbim.org.cn/api/frontend',
                changeOrigin: true,
                secure: true,
                logLevel: 'debug',
                pathRewrite: {
                    '/api/resourceApi': ''
                }
            },
            '/api/docApi': {
                // target: "http://10.80.2.76:8087",
                // 本地调试用
                // target: "https://staging.cbim.org.cn/app/doc",
                target: 'https://dev.cbim.org.cn/app/doc',
                // target: 'https://test2.cbim.org.cn/app/doc',
                changeOrigin: true,
                secure: true,
                logLevel: 'debug',
                pathRewrite: {
                    '/api/docApi': ''
                }
            },
            '/api': {
                // // target: 'http://10.80.2.76:8087',
                // // 本地调试用
                // // target: "https://staging.cbim.org.cn/app/home",
                // target: 'https://dev.cbim.org.cn/app/home',
                // // target: 'https://test2.cbim.org.cn/app/home',
                // changeOrigin: true,
                // secure: true,
                // logLevel: 'debug'
                target: 'https://120.52.22.227',
                pathRewrite: { '^/api/raas': '/' },
                changeOrigin: true,
                secure: false,
                headers: {
                    'app_id': '01774400-79a6-45af-9bc7-151bcf0b9b81',
                    'app_secret': 'BRChXwd7SlcmXMjjM3ZudBIQSN78PByBALY6',
                    'Cookie': 'X-SID=ZWY5NGRiYWEtMDRjZi00MWExLWFhOTEtYjFjYWUyOWY4NWE2; ANO-SID=2203240136030-BNKLH; mongo-express=s%3AcZbz-pmUUag7g2EumMTO-xFCqaJpopcf.EkwkHPWF6nIpEFRXGtTirODT1%2FkIEyyq%2BJqVjaEwd7M; userInfo={"name":"%E8%AE%BF%E5%AE%A2","loginName":"%E8%AE%BF%E5%AE%A2"}; _ga=GA1.1.572034527.1657843335; ren.tk=2784cd79924b2d07fe1816d59c3d6e26; ren-userInfo=%7B%22id%22%3A%22772142843825942528%22%2C%22email%22%3A%22%22%2C%22name%22%3A%22%u5929%u5065%22%2C%22phone%22%3A%2213918411092%22%2C%22role%22%3A%2213918411092%22%2C%22moduleIds%22%3A%5B%5D%2C%22sex%22%3A0%2C%22userName%22%3A%22%22%2C%22avatalURL%22%3Anull%2C%22domain%22%3A%22localhost%3A10000%22%7D'
                }
            },
            '/api/annoBThreeTest': {
                target: 'https://cbim-test-annotation.cctcltd.com:21443/api',
            },
            '/api/render': {
                target: 'https://120.52.22.227',
                pathRewrite: { '^/api/raas': '/' },
                changeOrigin: true,
                secure: false,
                headers: {
                    'app_id': '01774400-79a6-45af-9bc7-151bcf0b9b81',
                    'app_secret': 'BRChXwd7SlcmXMjjM3ZudBIQSN78PByBALY6',
                    'Cookie': 'X-SID=ZWY5NGRiYWEtMDRjZi00MWExLWFhOTEtYjFjYWUyOWY4NWE2; ANO-SID=2203240136030-BNKLH; mongo-express=s%3AcZbz-pmUUag7g2EumMTO-xFCqaJpopcf.EkwkHPWF6nIpEFRXGtTirODT1%2FkIEyyq%2BJqVjaEwd7M; userInfo={"name":"%E8%AE%BF%E5%AE%A2","loginName":"%E8%AE%BF%E5%AE%A2"}; _ga=GA1.1.572034527.1657843335; ren.tk=2784cd79924b2d07fe1816d59c3d6e26; ren-userInfo=%7B%22id%22%3A%22772142843825942528%22%2C%22email%22%3A%22%22%2C%22name%22%3A%22%u5929%u5065%22%2C%22phone%22%3A%2213918411092%22%2C%22role%22%3A%2213918411092%22%2C%22moduleIds%22%3A%5B%5D%2C%22sex%22%3A0%2C%22userName%22%3A%22%22%2C%22avatalURL%22%3Anull%2C%22domain%22%3A%22localhost%3A10000%22%7D'
                }
            },
            '/rass/api': {
                target: 'https://120.52.22.227',
                pathRewrite: { '^/rass/api': '/rass' },
                changeOrigin: true,
                secure: false,
                headers: {
                    'app_id': '01774400-79a6-45af-9bc7-151bcf0b9b81',
                    'app_secret': 'BRChXwd7SlcmXMjjM3ZudBIQSN78PByBALY6',
                    'Cookie': 'X-SID=ZWY5NGRiYWEtMDRjZi00MWExLWFhOTEtYjFjYWUyOWY4NWE2; ANO-SID=2203240136030-BNKLH; mongo-express=s%3AcZbz-pmUUag7g2EumMTO-xFCqaJpopcf.EkwkHPWF6nIpEFRXGtTirODT1%2FkIEyyq%2BJqVjaEwd7M; userInfo={"name":"%E8%AE%BF%E5%AE%A2","loginName":"%E8%AE%BF%E5%AE%A2"}; _ga=GA1.1.572034527.1657843335; ren.tk=2784cd79924b2d07fe1816d59c3d6e26; ren-userInfo=%7B%22id%22%3A%22772142843825942528%22%2C%22email%22%3A%22%22%2C%22name%22%3A%22%u5929%u5065%22%2C%22phone%22%3A%2213918411092%22%2C%22role%22%3A%2213918411092%22%2C%22moduleIds%22%3A%5B%5D%2C%22sex%22%3A0%2C%22userName%22%3A%22%22%2C%22avatalURL%22%3Anull%2C%22domain%22%3A%22localhost%3A10000%22%7D'
                }  
            },
            '/raas': {
                target: 'https://120.52.22.227',
                pathRewrite: { '^/raas': '/' },
                changeOrigin: true,
                secure: false,
                headers: {
                    'app_id': '01774400-79a6-45af-9bc7-151bcf0b9b81',
                    'app_secret': 'BRChXwd7SlcmXMjjM3ZudBIQSN78PByBALY6'
                }
            }
        }
    }
}
