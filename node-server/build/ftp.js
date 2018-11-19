const inquirer = require('inquirer');
const FtpDeploy = require('ftp-deploy');
const ora = require('ora');

const PROJECT_NAME = require('../package.json').name;
const REMOTE_PATH = '/root/node-server/';

inquirer.prompt([{
  type: 'confirm',
  message: '需要上传到 FTP 服务器么? ',
  default: 'n',
  name: 'ok'
}]).then(function (answers) {
  if (answers.ok) {
    inquirer.prompt([{
      type: 'rawlist',
      message: '选择要上传到的 FTP 服务器: ',
      name: 'host',
      choices: [118, 48, 75, 76, 77, 234, 60, 74].map(function (v) {
        return '140.143.245.' + v;
      })
    }, {
      type: 'password',
      message: '请输入 FTP 服务器密码: ',
      name: 'password'
    }]).then(function (answer) {
      console.log(`即将上传到 ${answer.host} 的 ${REMOTE_PATH} 目录,请确认目录存在且属于 root 用户。`);
      const spinner = ora('正在上传...');
      spinner.start();
      const ftpDeploy = new FtpDeploy();

      const config = {
        user: 'root',
        host: answer.host,
        password: 'caoke907167',
        port: 21,
        localRoot: __dirname+'/../../node-server/',
        remoteRoot: REMOTE_PATH,
        include: [ '*','**/*'],
        exclude: ['.git', '.idea', 'tmp/*','node_modules/**/*', '.bat'],
        deleteRoot: true                // delete existing files at destination before uploading
      };
      ftpDeploy.deploy(config, function (err) {
        spinner.stop();
        console.log(err || '上传完成~ \nヾ(^_^) byebye!!');
      });
    });
  } else {
    console.log('ヾ(^_^) byebye!!');
  }
});
