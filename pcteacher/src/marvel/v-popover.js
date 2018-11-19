
/**
 * 示例: v-popover  v-popover:fadeIn="message"
 */

/** 字符串转为dom节点 */
function parseDom(arg) {
　　 var objE = document.createElement("div");
　　 objE.innerHTML = arg;
　　 return objE.childNodes[0];
};
/** popover内联样式 */
let styleObj = {
    width: '301px',
    display: 'none',
    background: '#909599',
    color: '#fff',
    padding: '10px',
    'border-radius': '2px',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    'z-index': 99,
    margin: '0 auto',
}
/** 对象转成字符串 */
function objToStr(obj){
    var str = '';
    for(var key in obj){
        str+=`${key}:${obj[key]};`
    }
    return str;
}

export const popover = {
    bind: function(el, binding){
        let s = JSON.stringify, 
            animate = binding.arg,
            childNode = parseDom(`<p class="animated ${animate}" style="${objToStr(styleObj)}">${s(binding.value)}</p>`);
        el.appendChild(childNode);
        el.addEventListener('mouseenter', function(){
            childNode.style.display= 'block';
            childNode.style.bottom= -childNode.clientHeight+'px';
        }, false);
        el.addEventListener('mouseleave', function(){
            childNode.style.display= 'none';
        }, false);
    },
}

