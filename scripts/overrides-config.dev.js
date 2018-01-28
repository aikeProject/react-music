const baseConfig = require('./overrides-config.base');
module.exports = function(config) {

    // Use your ESLint
    /*let eslintLoader = config.module.rules[0];
    eslintLoader.use[0].options.useEslintrc = true;*/

    // Add the stylus loader second-to-last
    // (last one must remain as the "file-loader")
    let loaderList = config.module.rules[1].oneOf;
    loaderList.splice(loaderList.length - 1, 0, {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"]
    });

    // 自冬添加css前缀
    config.plugins.push(baseConfig.stylusLoaderOptionsPlugin);

    // 根路径别名
    let alias = config.resolve.alias;
    alias["@"] = baseConfig.rootPath;
};