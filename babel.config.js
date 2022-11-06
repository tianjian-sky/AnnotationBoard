module.exports = {
    // presets: ['@vue/cli-plugin-babel/preset']
    presets: [
        [
          "@babel/preset-env",
          {
            "modules": false
          }
        ],
        // "@vue/babel-preset-jsx",
      ],
    plugins: [
        // [
        //   "component",
        //   {
        //     "libraryName": "element-ui",
        //     "styleLibraryName": "theme-chalk"
        //   }
        // ],
        // [
        //   "@nutui/babel-plugin-separate-import",
        //   {
        //     "libraryName": "@nutui/nutui",
        //     "libraryDirectory": "dist/packages",
        //     "style": "scss"
        //   }
        // ],
        "@babel/plugin-transform-spread",
        "@babel/plugin-transform-runtime",
        "@vue/babel-plugin-jsx"
    ]
}
