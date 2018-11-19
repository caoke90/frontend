/*
* @Author: bin.liu
* @Date:   2018-09-05 17:55:34
* @Last Modified by:   bin.liu
* @Last Modified time: 2018-09-05 17:59:16
*/

// 引入公共配置1
import Vue from '../common/mbase';

// 项目的入口
import App from '../views/feedback';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<div><mv-modal></mv-modal><App/></div>'
})
