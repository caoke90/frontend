/*js报错处理*/
let url = 'http://log.17zuoye.net/log';
let place = 'venus_js_error';
export default function(err, el, vueInfo, clientInfo, qobj){
	/*eslint-disable no-undef*/
	if(__ENV__ != 'dev'){
		var href = encodeURIComponent(window.location.href);
		el = JSON.stringify({
			id: el.id,
			className: el.className
		});

		var useragent = (window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : "No browser information";
		var log = JSON.stringify({
			url: href,
			errMsg: err.toString(),
			el: el,
			vueInfo: vueInfo,
			clientInfo: clientInfo,
			userAgent: useragent,
			questionId: qobj ? qobj.id : ''
		});
		var src = `${url}?_c=vox_logs:${place}&_l=3&_log=${log}`;
		var img = new Image();
		img.src = src;
	}
}