# template 模版项目

> A Vue.js project
* 构建过程
* 安装过程
* 差异点
* 打包优化


## 构建过程
```bash
bogon:vue-cli caoke$ vue init webpack template

? Project name template
? Project description A Vue.js project
? Author caoke <caoke@caoke.com>
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? No
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recommended) npm

   vue-cli · Generated "template".


# Installing project dependencies ...
# ========================
```

## 1、安装过程

``` bash
# 安装依赖
npm install

# 启动热服务 localhost:8080
npm run dev

# 压缩打包
npm run build

# 压缩打包 and 查看打包分析图
npm run build --report

# 打包成测试环境
 "deployTest": "cross-env assetsPublicPath=//zx.test.17zuoye.net/ node build/build.js",

# 打包成线上环境
"deployOnline": "cross-env assetsPublicPath=//www.17zuoye.com/ node build/build.js",


```
### 2、差异点
2-1:新建目录
```
/src/api 服务接口口请求
/src/assets png、js、css资源存放
/src/common 公用资源
/src/components 项目内部组件
/src/directive vue指令
/src/entry 入口js
/src/marvel 第三份公用组件库
/src/models 数据模型
/src/router 路由
/src/utils 公用工具
/src/views 页面

```
2-2:package.json
```
  "axios": "^0.18.0",
  "element-ui": "^2.3.8",
  "glob": "^7.1.2",
  "less": "^3.0.2",
  "less-loader": "^4.1.0",
  "node-sass": "^4.9.0",
  "photoswipe": "^4.1.2",
  "qs": "^6.5.2",
  "sass-loader": "^7.0.1",
  "stylus": "^0.54.5",
  "stylus-loader": "^3.0.2",
  "text-loader": "^0.0.1",
  "vue-markdown": "^2.2.4",
```

2-3:webpack.prod.conf.js 自动配置entry，看打包优化部分
```
const test = require('./better');

const entry=test.getproEntry()
const htmlConfig=test.getproHtmlWebpack();
const commonsConfig=test.getCommonsChunk();

 entry: entry,

   chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')

    ...htmlConfig,
    ...commonsConfig,

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks (module) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),

   // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   minChunks: Infinity
    // }),

```
2-4:webpack.dev.conf.js 自动配置entry
```
const test = require('./better');

const entry=test.getdevEntry()

const htmlConfig=test.getdevHtmlWebpack();

  entry: entry,

 ...htmlConfig,


```
2-4:vue-loader.conf.js
```
esModule: false
```

2-5:config/index.js
```
const productName = require('../package').name||'template';
 dev: {

    // Paths
    assetsSubDirectory: productName,
    assetsPublicPath: '/',
    proxyTable: {
      /*
      域名:https://www.easy-mock.com/
      用户名:caoke
      密码:123456
      * */
      '/api': {
        target: 'https://www.easy-mock.com/', // 接口的域名
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '/api': '/mock/596f19b1a1d30433d837ad7d/example'
        }
      }

    },


  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../../dist/'+productName+'/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../../dist'),
    assetsSubDirectory: productName,
    assetsPublicPath: '/',


productionSourceMap: false,

```

## 3、自动配置和打包优化
* 3-1:根据entry目录，自动配置入口和html，以dev开头的文件不会发布到生产环境.
* 3-2:以公共文件名开头的文件，回生产公共文件。如a.demo.js、b.demo.js生产公共文件a.js。
* 3-3:子目录也遵循上述规范，也会生产对应的html、js、公共文件
* 3-3:在better.js手动配置公共的js，格式如下
```
const commonConfig={
  'demo':['demo1','demo2'],//demo1、demo2的公共demo.js
  // 'vendor':true,//所有页面的公共demo.js
}
```

build/better.js

```
//打包优化配置
const glob = require('glob');
const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const productName = require('../package').name||'template';
/*
* a.demo1.js、a.demo2.js
* 表示存在公共的a.js,
* 会生产 a.[md5].js a.demo1.[md5].js a.demo2.[md5].js 3个文件
*
* */
//公共模块的配置
const commonConfig=getcommons();

function getcommons(){
  const obj=getproEntry();
  const commonCache={}
  const commonConfig={}
  for(let ke in obj){
    ke.replace(/([a-z]+)\./i,function (m,p1) {
      if(!commonCache[p1]){commonCache[p1]=[];}
      commonCache[p1].push(ke)
      if(commonCache[p1].length==2){
        commonConfig[p1]=commonCache[p1]
      }
    })
  }

  return commonConfig;
}
function getCommonsChunk() {
  const data=[]
  for(let name in commonConfig){
    if(Array.isArray(commonConfig[name])){
      data.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: name,
          minChunks:2,
          chunks:commonConfig[name]
        }))
    }
  }
  return data;
}

function getCommonBy(cname) {
  const commons=[]
  for(let name in commonConfig){
    if(commonConfig[name].length>0&&commonConfig[name].indexOf(cname)>-1){
      commons.push(name)
    }
  }
  return commons;
}
/*
  获取入口entry的所有js文件
 */
function getdevEntry() {
  const arr = glob.sync(__dirname+'/../src/entry/**/*.js')

  const entry={}
  arr.forEach(function (file) {
    file.replace(/entry\/(.+)\.js$/,function (m,p1) {
      entry[p1]=file
    })
  })
  return entry;
}
//获取生产环境入口配置
function getproEntry() {
  const arr = glob.sync(__dirname+'/../src/entry/**/!(dev.)*.js')

  const entry={}
  arr.forEach(function (file) {
    file.replace(/entry\/(.+)\.js$/,function (m,p1) {
      entry[p1]=file
    })
  })


  return entry;
}

/*
  生产html配置
 */
function getdevHtmlWebpack() {
  const entry=getdevEntry();
  const htmlConfig=[]
  for(let name in entry){
    htmlConfig.push(new HtmlWebpackPlugin({
      title:name,
      filename: productName+'/'+name+'.html',
      template: 'index.html',
      inject: true,
      chunks:[name],
      chunksSortMode: 'dependency'
    }))
  }
  return htmlConfig;
}
function getproHtmlWebpack() {
  const entry=getproEntry();
  const htmlConfig=[]

  for(let name in entry){
    const cmchunks=getCommonBy(name);
    htmlConfig.push(new HtmlWebpackPlugin({
      title:name,
      filename: path.resolve(__dirname, '../../dist/'+productName+'/'+name+'.html'),
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        // collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunks:[...cmchunks,name],
      chunksSortMode: 'manual'
    }))
  }
  return htmlConfig;
}
module.exports={
  getdevEntry,//自动配置开发环境入口
  getproEntry,//自动配置生产环境入口
  getdevHtmlWebpack,//自动配置开发环境html
  getproHtmlWebpack,//自动配置生产环境入口
  getCommonsChunk,//自动配置生产环境公共资源
};


```

## 4、入口模板
```
//引入公共配置
import Vue from '../common/pcbase';
/*
  2、注册 组件容器
  展示组件的容器
* */
Vue.component('card', require('../components/card.vue'));

//1、导入elm ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small' });

//项目的入口
import App from '../views/demo2'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: ' <div><mv-modal></mv-modal><App/></div>'
})

```
## 5、打包构建速度优化
使用多线程压缩打包插件 webpack-parallel-uglify-plugin
```
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

 new AssetsPlugin({
      prettyPrint:true,
      fullpath:true
    }),
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS:{
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }
    }),
```
## 6、本地mock
原理：路由的rewrite，以及代理插件
1、是否以http开头，用代理转发到url
2、以"/"开头，则在本地目录查找，是否存在该文件，返回该文件的json数据
3、不存在就做路由转发
```
module.exports=[
  {

    //本地的url =》 本地的url
    // "/":"/mteacher/tcbag.html",
  },{
    //线上的url =》 本地的mock
    "/ok":"/ok",
  }
]

```
