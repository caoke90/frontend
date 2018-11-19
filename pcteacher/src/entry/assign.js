// 引入公共配置1
import Vue from '../common/pcbase';
import '@babel/polyfill';
import 'es6-promise/auto';

// 项目的入口
import App from '../views/assign.vue';
import question from '../components/question';

Vue.component('question', question);

// 引入element ui
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
import { DatePicker,Pagination } from 'element-ui';
Vue.use(DatePicker);
Vue.use(Pagination);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {App},
  template: ' <div><mv-modal></mv-modal><App/></div>'
})


