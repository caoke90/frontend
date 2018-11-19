'use strict'
module.exports = {
  buildTime:JSON.stringify(new Date().toLocaleString()),
    NODE_ENV: '"staging"',
    STAGE: JSON.stringify(process.env.STAGE),
    zybaseURL:'"//zy.staging.17zuoye.net"',
    wwwbaseURL:'"//www.staging.17zuoye.net"',
    zxbaseURL:'"//zx.staging.17zuoye.net"',
    centerbaseURL:'"//ucenter.staging.17zuoye.net'
}

