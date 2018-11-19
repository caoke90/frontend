// 引入公共配置1
import Vue from '../common/mbase';

// 项目的入口
import App from '../views/readMode';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {App},
  template: ' <div><mv-modal></mv-modal><App/></div>'
})
