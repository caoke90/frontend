/**
 * 渲染数学公式
*/

export function mathJax(el,callback){
	window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, el],function(){
		callback && callback();
	});
}