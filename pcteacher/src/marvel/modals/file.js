//往服务容器 添加服务
/*api
 Bus.$emit("getFile",function (file) {
    console.log(file)
  })
* */
import Bus from '../bus';

Bus.addModalComponent(require('./file.vue'))
export default Bus;
