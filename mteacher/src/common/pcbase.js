//pc端：使用路由、图片懒加载、element-ui、服务、组件
import Vue from 'vue'

/*
* 图片懒加载*/
Vue.component('mv-img', require('../marvel/img.vue'));
/*
  1、注册 服务容器 mv-modal
  增加服务的接口
* */

Vue.component('mv-modal', require('../marvel/modal.vue'));


//项目公用的
require('../common/pcbase.css');
require('../common/scss/animate.scss');

export default Vue;
