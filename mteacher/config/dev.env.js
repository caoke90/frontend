'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  buildTime:JSON.stringify(new Date().toLocaleString()),
  NODE_ENV: '"development"',
  baseUrl:'"/"'
})
