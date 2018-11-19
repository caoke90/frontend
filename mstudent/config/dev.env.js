'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  buildTime:JSON.stringify(new Date().toLocaleString()),
  NODE_ENV: '"development"',
  zybaseURL:'""',
  wwwbaseURL:'"//zy.test.17zuoye.net"',
  zxbaseURL:'""',
  centerbaseURL:'"//ucenter.test.17zuoye.net"'
})
