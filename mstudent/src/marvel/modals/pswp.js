//注册服务
/*api

 Bus.$emit("mvGallery",index,lists)
* */
import Bus from '../bus';

Bus.addModalComponent(require('./pswp.vue'))
export default Bus;
