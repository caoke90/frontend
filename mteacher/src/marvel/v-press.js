
/**
 * 示例: v-press v-press:className
 * className可配置
 */
let node, className;
function handle(){
  if(node && className){
    node.classList.remove(className);
    node = className =  null;
  }
}
module.exports={
  inserted: function(el, binding){
    // 开始触发touch事件
    el.addEventListener('touchstart', function(e){
      node = e.currentTarget;
      className = binding.arg;
      node.classList.add(binding.arg);
    }, false);
    el.addEventListener('touchmove', handle, false);
    el.addEventListener('touchend', handle, false);
  }
}

