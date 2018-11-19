import 'es6-promise/auto';
import 'core-js/es7/array'
// pc端：使用路由、图片懒加载、element-ui、服务、组件
import Vue from 'vue'

import {getInitParams} from './js/external';
import {sendLog} from './js/logger';

/*
* 图片懒加载
*/
Vue.component('mv-img', require('../marvel/img.vue'));

/*
* 触碰区域
* */
Vue.directive('press', require('../marvel/v-press'));

/*
  1、注册 服务容器 mv-modal
  增加服务的接口
* */

Vue.component('mv-modal', require('../marvel/modal.vue'));


// 项目公用的
require('../common/base.css');
require('../common/750rem.css');
require('../common/scss/question.scss');
require('../common/js/jsError');
require('../common/js/task');

// window.sendLog = sendLog;
window.initParams = getInitParams();
window.appInfo = {
  appName: 'mteacher',
  userId: window.initParams.user_id || '',
  subject: window.initParams.subject || '',
  env: window.initParams.server_type || window.initParams.env
};

export default Vue;
