/* eslint-disable */
"use strict";

/**
* 一个函数节流的函数 主要用在频繁操作上(resize scroll) 简单理解就是 将频繁操作，间隔由浏览器自己的(一般都是2ms）执行一次，该为你想要的频率
* @param
*    fn : 要执行的函数
*    delay : 多少时间后执行 单位ms
*    scope :  指定上下文
* @return
*    function
*/
export function throttle(fn, delay, scope){

	delay || (delay = 250);

	var last,
		deferTimer;

	return function () {
		var context = scope || this;

		var now = +new Date(),
			args = arguments,
			done_fn = function(immediate){
				last = immediate ? now : +new Date();

				deferTimer = null;
				fn.apply(context, args);
			};

		if (last === undefined || (now - last) >= delay){
			clearTimeout(deferTimer);
			return done_fn(true);
		}

		// deferTimer !== null  就会阻止一次动作结束后，新一轮的动作在结束时，应该还会有一次动作的行为
		deferTimer === null && (deferTimer = setTimeout(done_fn, delay));

	};
}


/**
* 一个控制频繁操作的函数节流。 简单理解： 我从顶部滑动倒底部，规定的时间间隔到了，我才执行！
* @param func      : 要执行的函数
* @param wait      : 等待时间ms
* @param immediate : 是否在规定时间头执行，还是时间过后才执行
* @param score     : 上下文
*
* @return function
*
*/
export function debounce(func, wait, immediate, score) {

	var timeout;

	wait || (wait = 250);

	return function() {
		var context = score || this,
			args = arguments;

		var later = function() {
			timeout = null;

			!immediate && func.apply(context, args);
		};

		var callNow = immediate && !timeout;

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		callNow && func.apply(context, args);

	};

}
