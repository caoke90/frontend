import 'es6-promise/auto';
import 'core-js/es7/array'

//pc端：使用路由、图片懒加载、element-ui、服务、组件
import Vue from 'vue'
import {popover} from '../marvel/v-popover'

/*
* 图片懒加载*/
Vue.component('mv-img', require('../marvel/img.vue'));
/*
  1、注册 服务容器 mv-modal
  增加服务的接口
* */

Vue.component('mv-modal', require('../marvel/modal.vue'));

/** 注册popover指令 */
Vue.directive('popover', popover);

//项目公用的
require('../common/pcbase.css');
require('./scss/animate.scss');
require('../common/js/jsError');

window.appInfo = {
  appName: 'webteacher',
  userId: '',
  subject: 'ENGLISH',
  env: process.env.STAGE || 'dev'
};

console.log(process.env);

// 中英接口
window.zybaseURL=location.protocol+(process.env.zybaseURL||'//'+location.host);
// 17练习域名
window.wwwbaseURL=location.protocol+process.env.wwwbaseURL;
// 中学域名
window.zxbaseURL=location.protocol+(process.env.zxbaseURL||'//'+location.host);
// 用户中心域名
window.centerbaseURL=location.protocol+process.env.centerbaseURL;
export default Vue;
