'use strict'
module.exports = {
  buildTime:JSON.stringify(new Date().toLocaleString()),
  NODE_ENV: '"production"',
  STAGE: JSON.stringify(process.env.STAGE),
  zybaseURL:'"//zy.17zuoye.com"',
  wwwbaseURL:'"//www.17zuoye.com"',
  zxbaseURL:'"//zx.17zuoye.com"',
  centerbaseURL:'"//ucenter.17zuoye.com"'
}

