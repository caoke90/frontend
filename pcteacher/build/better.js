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
  const obj=getproEntry()
  const arr=Object.keys(obj)
  console.log(arr)
  const data=[
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      chunks: ['vendor'],
      // minChunks:Infinity
    }),
  ]
  for(let name in commonConfig){
    if(Array.isArray(commonConfig[name])){
      data.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: name,
          minChunks:commonConfig[name].length,
          chunks:commonConfig[name]
        })
      )
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

  const entry={
    vendor:["vue"]
  }
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
//是否存在模板
const fs=require("fs")
function getTemplate(name){
  const pt=__dirname+'/../src/tpl/'+name+'.html'
  if(fs.existsSync(pt)){
    return pt;
  }
}
function getdevHtmlWebpack() {
  const entry=getdevEntry();
  const htmlConfig=[]
  for(let name in entry){
    htmlConfig.push(new HtmlWebpackPlugin({
      title:productName,
      filename: productName+'/'+name+'.html',
      template: getTemplate(name)||'index.html',
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
      title:productName,
      productName:productName,
      filename: path.resolve(__dirname, '../../dist/'+productName+'/'+name+'.html'),
      template: getTemplate(name)||'index.html',
      inject: true,
      minify: {
        removeComments: true,
        // collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunks:['manifest','vendor',...cmchunks,name],
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
