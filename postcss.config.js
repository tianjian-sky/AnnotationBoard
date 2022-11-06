const path = require('path')
module.exports = {
    plugins: {
        "postcss-plugin-px2rem": {
            rootValue: 100,
            unitPrecision: 5,
            propWhiteList: [],
            propBlackList: [],
            exclude: path.resolve(__dirname, './node_modules/element-plus'),
            selectorBlackList: [],
            ignoreIdentifier: false,
            replace: true,
            mediaQuery: false,
            minPixelValue: 0
        }
    }
}
