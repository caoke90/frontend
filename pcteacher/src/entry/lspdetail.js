// 引入公共配置1
import Vue from '../common/pcbase';

// 项目的入口
import App from '../views/lspdetail';

import question from '../components/question';

Vue.component('question', question);
// 引入element ui
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
import { DatePicker } from 'element-ui';
Vue.use(DatePicker);

/* eslint-disable no-new */
new Vue({
        el: '#app',
        components: {App},
        template: '<div><mv-modal></mv-modal><App/></div>'
});


