// 引入公共配置1
import Vue from '../common/v-base';

// 项目的入口
import App from '../views/venus';
import Bus from '../marvel/bus';

/* eslint-disable no-new */
const VenusApp = {
  // 入口
  init(config){
    Bus.config=config;
    new Vue({
      el: config.el,
      components: {App},
      template: ' <App/>'
    })

  }
};

export default VenusApp;



