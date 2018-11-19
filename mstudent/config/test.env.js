'use strict'
module.exports = {
  buildTime:JSON.stringify(new Date().toLocaleString()),
    NODE_ENV: '"test"',
    STAGE: JSON.stringify(process.env.STAGE),
    zybaseURL:'"//zy.test.17zuoye.net"',
    wwwbaseURL:'"//zy.test.17zuoye.net"',
    zxbaseURL:'"//zx.test.17zuoye.net"',
    centerbaseURL:'"//ucenter.test.17zuoye.net"'
}
