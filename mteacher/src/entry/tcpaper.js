// 引入公共配置1
import Vue from '../common/mbase';

// 项目的入口
import App from '../views/tcpaper';

import question from '../components/question';
import {updateTitle} from '../common/js/external/index';

Vue.component('question', question);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {App},
  template: '<div><mv-modal></mv-modal><App/></div>',
  data: {
    pageType: "paperPackage"
  },
  created: function () {
    updateTitle('套卷详情','','');
  }
});
