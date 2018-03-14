#### 自定义react官方脚手架(create-react-app)
* 使用rewire模块
```text
yarn add rewire proxyquire --dev
```
* 配置方法
    * 新建`scripts`文件夹
    * 在`scripts`下新建`customized-build.js`文件
    ```js
    /*
      本模块运行react-scripts里的脚本 (Create React App)
      可以自定义webpack配置，通过在项目根目录创建"overrides-config.dev.js" 、 "overrides-config.prod.js" 文件.
    
      A config-overrides file should export a single function that takes a
      config and modifies it as necessary.
    
      module.exports = function(webpackConfig) {
        webpackConfig.module.rules[0].use[0].options.useEslintrc = true;
      };
    */
    var rewire = require('rewire');
    var proxyquire = require('proxyquire');
    
    switch(process.argv[2]) {
      // The "start" script is run during development mode
      case 'start':
        rewireModule('react-scripts/scripts/start.js', loadCustomizer('./overrides-config.dev'));
        break;
      // The "build" script is run to produce a production bundle
      case 'build':
        rewireModule('react-scripts/scripts/build.js', loadCustomizer('./overrides-config.prod'));
        break;
      // The "test" script runs all the tests with Jest
      case 'test':
        // Load customizations from the config-overrides.testing file.
        // That file should export a single function that takes a config and returns a config
        let customizer = loadCustomizer('./overrides-config.testing');
        proxyquire('react-scripts/scripts/test.js', {
          // When test.js asks for '../utils/createJestConfig' it will get this instead:
          '../utils/createJestConfig': (...args) => {
            // Use the existing createJestConfig function to create a config, then pass
            // it through the customizer
            var createJestConfig = require('react-scripts/utils/createJestConfig');
            return customizer(createJestConfig(...args));
          }
        });
        break;
      default:
        console.log('customized-build only supports "start", "build", and "test" options.');
        process.exit(-1);
    }
    
    // Attempt to load the given module and return null if it fails.
    function loadCustomizer(module) {
      try {
        return require(module);
      } catch(e) {
        if(e.code !== "MODULE_NOT_FOUND") {
          throw e;
        }
      }
    
      // If the module doesn't exist, return a
      // noop that simply returns the config it's given.
      return config => config;
    }
    
    function rewireModule(modulePath, customizer) {
      // Load the module with `rewire`, which allows modifying the
      // script's internal variables.
      let defaults = rewire(modulePath);
    
      // Reach into the module, grab its global 'config' variable,
      // and pass it through the customizer function.
      // The customizer should *mutate* the config object, because
      // react-scripts imports the config as a `const` and we can't
      // modify that reference.
      let config = defaults.__get__('config');
      customizer(config);
    ```
    *   配置css预处理语言`stylus`
        *   安装`yarn add stylus stylus-loader --dev`
    ```js
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
     };
    ```
    * 新建 `overrides-config.prod.js`
    ```js
    const paths = require('react-scripts/config/paths');
    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    
    // Webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    const publicPath = paths.servedPath;
    // Some apps do not use client-side routing with pushState.
    // For these, "homepage" can be set to "." to enable relative asset paths.
    const shouldUseRelativeAssetPaths = publicPath === './';
    const cssFilename = 'static/css/[name].[contenthash:8].css';
    const extractTextPluginOptions = shouldUseRelativeAssetPaths
        ? // Making sure that the publicPath goes back to to build folder.
        { publicPath: Array(cssFilename.split('/').length).join('../') }
        : {};
    
    module.exports = function(config) {
    
        // Use your ESLint
        /*let eslintLoader = config.module.rules[0];
        eslintLoader.use[0].options.useEslintrc = true;*/
    
        // Add the stylus loader second-to-last
        // (last one must remain as the "file-loader")
        let loaderList = config.module.rules[1].oneOf;
        loaderList.splice(loaderList.length - 1, 0, {
            test: /\.styl$/,
            loader: ExtractTextPlugin.extract(
                Object.assign(
                    {
                        fallback: {
                            loader: require.resolve('style-loader'),
                            options: {
                                hmr: false
                            }
                        },
                        use: [
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    minimize: true,
                                    sourceMap: true
                                }
                            },
                            {
                                loader: require.resolve('stylus-loader')
                            }
                        ]
                    }
                ), extractTextPluginOptions)
        });
    };
    ```
    *   修改启动脚本
    ```json
    "scripts": {
        "start": "node scripts/customized-build start",
        "build": "node scripts/customized-build build",
        "test": "react-scripts test --env=jsdom",
        "eject": "react-scripts eject"
      }
    ```
    *   加入`autoprefixer`
        * 安装`yarn add poststylus --dev`
    ```js
    // 新建overrides-config.base.js配置文件，增加poststylus插件配置
    const webpack = require('webpack');
    const poststylus = require('poststylus');
    const autoprefixer = require('autoprefixer');
    module.exports.stylusLoaderOptionsPlugin = new webpack.LoaderOptionsPlugin({
        options: {
          stylus: {
            use: [
              poststylus([ 
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                })
              ])
            ]
          }
        }
      });
    ```
    * 项目配置根路径别名
    ```js
    // overrides-config.base.js 文件中增加这样的代码
    const path = require('path');
    .....
    .....
    function resolve (dir) {
      return path.join(__dirname, '..', dir)
    }
    
    module.exports.rootPath = resolve('src');
    ```
*   QQ音乐接口
```
* 轮播接口
    https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?
    g_tk=964895631&uin=1121352970&format=json&inCharset=utf-8&
    outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1516501673247
* 音乐列表接口
https://u.y.qq.com/cgi-bin/musicu.fcg?
    callback=getUCGI10455592910292011&g_tk=964895631&jsonpCallback=getUCGI10455592910292011&loginUin=1121352970&hostUin=0&
    format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&
    data=%7B%22albumlib%22%3A%7B%22method%22%3A%22get_album_by_tags%22%2C%22param%22%3A%7B%22area%22%3A7%2C%22company%22%3A-1%2C%22genre%22%3A-1%2C%22type%22%3A-1%2C%22year%22%3A-1%2C%22sort%22%3A2%2C%22get_tags%22%3A1%2C%22sin%22%3A0%2C%22num%22%3A20%2C%22click_albumid%22%3A0%7D%2C%22module%22%3A%22music.web_album_library%22%7D%7D
```
****
* JSONP使用
    * 安装 `yarn add jsonp`
****
* 轮播插件 swiper
    * 安装 `npm install swiper@3.4.2 --save`
    * [官网](www.swiper.com.cn)
****
* 滑屏 Better-Scroll
    * 安装 `npm install better-scroll@1.5.5 --save`
    * [github地址](https://github.com/ustbhuangyi/better-scroll) 
****
* 优化图片加载
    * 图片懒加载
    * 使用`react-lazyload` ， 地址 [github](https://github.com/jasonslyvia/react-lazyload)
    * 安装 `npm install react-lazyload --save`
***
* 实现动画 react-transition-group 动画库
    * [详情](https://reactcommunity.org/react-transition-group/)
    ```js
     // CSSTransition接受in、timeout、classNames三个props。
     // 其中in控制组件的状态。
     // 当in为true时，组件的子元素会应用translate-enter、translate-enter-active样式，当in为false时，
     // 组件的子元素会应用translate-exit、translate-exit-active样式。timeout指定过渡时间
    ```
***
