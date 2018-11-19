/*
* @Author: bin.liu
* @Date:   2018-07-18 14:46:20
* @Last Modified by:   bin.liu
* @Last Modified time: 2018-08-03 15:43:35
*/

// 引入公共配置1
import Vue from '../common/mbase';

// 项目的入口
import App from '../views/lssdetail';

import question from '../components/question';

Vue.component('question', question);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<div><mv-modal></mv-modal><App/></div>'
})
