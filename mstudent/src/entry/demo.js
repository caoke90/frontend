// 引入公共配置1
import Vue from '../common/mbase';


import App from '../views/demo';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {App},
  template: '<div><mv-modal></mv-modal><App/></div>'
})



