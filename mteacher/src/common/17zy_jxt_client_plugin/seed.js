/*eslint-disable no-console*/
/**
* 客户端 h5交互逻辑
* @module dependes/client_plugin
* @author rambo <luwei.li@17zuoye.com>
*/

var WIN = window,
	DOC = document;

let do_external,
	check_exists,
	build_trigger_name = method=>`_17m.${method}`,
	toString = (obj, name)=>Object.prototype.toString.call(obj) === `[object ${name}]`;

const NOOP = ()=>{},
	message_id = '_17m_external';

if(toString(WIN.vox, 'Object')){
	WIN.vox.task || (WIN.vox.task = {});
}else{
	WIN.vox = { task : { }};
}

Object.defineProperty(WIN.vox, '_task', {
	value        : {}
});

let {task, _task} = WIN.vox,
	remove_event = (type, cb)=>{
		DOC.removeEventListener(type, cb);
	};

let bind_trigger = (method, cb, once)=>{
		if(!(method && cb)){
			return ;
		}

		var trigger_cb,
			_cb = arg=>{
				Array.isArray(arg) ? cb(...arg) : cb(arg);
			};

		if(once === 'RANDOM'){
			trigger_cb = event=>{
				_cb(event.detail);

				remove_event(event.type, trigger_cb);
			};
		}else{
			var z_cb = (type, args)=>{
				if(_task[method] === undefined){
					_task[method] = type;
				}

				_task[method] === type && _cb(args);
			};

			trigger_cb = event=>{
				z_cb('TRIGGER', event.detail);
				once && remove_event(event.type, trigger_cb);
			};

			task[method] = (...args)=>{
				if(args.length === 1){
					try {
						args = JSON.parse(args[0]);
					}catch(e){
						args = args[0];
					}
				}
				// 如果参数为多参数，则传给H5一个数组

				once && task[method] === NOOP;

				z_cb('VOX', args);
			};
		}

		DOC.addEventListener(build_trigger_name(method), trigger_cb);
	},
	check_status = (_args, cb_info)=>{
		let [method, param, ...args] = _args,
			status = 'ELSE';

		if(toString(method, 'Object')){  // You must use Object param when use this way;
			status = 'METHOD';
		}else if(toString(param, 'Object')){   // param为object
			status = 'OBJ_PARAM';
		}else if(toString(param, 'Function')){  // 无param
			status = 'FN_PARAM';
		}else{
			var cb = args[args.length - 1];

			if(toString(cb, 'Function')){
				param = [param, ...args.slice(0, -1)];
			}else{
				param && (param = [param, ...args]);
			}

			args = cb;
		}

		return cb_info[status](method, param, args);
	};

// http://wiki.17zuoye.net/pages/viewpage.action?pageId=31938486
var support_wk_webview = (()=>{
	try{
		WIN.webkit.messageHandlers[message_id].postMessage;

		return true;
	}catch(e){
		return false;
	}
})();

if(support_wk_webview){
	/*
	let get_guid = ()=>'xx-xx-4x-yx-xx'.replace(/[xy]/g, c=>{
		var r = Math.random() * 16 | 0;

		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	*/

	// 相邻Date.now() 会得到相同的时间戳
	let get_guid = ()=>Math.random() * Date.now();

	do_external = (..._args)=>{
		let res = check_status(_args, {
			METHOD : (method)=>method,
			OBJ_PARAM : (method, param, args)=>{
				return {
					method,
					param,
					cb : args[0]
				};
			},
			FN_PARAM : (method, param)=>{
				return {
					method,
					cb : param
				};
			},
			ELSE : (method, param, cb)=>{
				return {
					method,
					param : param &&
						param.reduce((prev, curr, index)=>{  // 这里之因为不传真数组，因客户端还需要判断重载函数以及解析类型还需判断，所以在js这里将Array to Map
							prev[index] = curr;

							return prev;
						}, {}),
					cb
				};
			}
		});

		let {method, param, cb} = res,
			_do_external = cb_id=>{
				WIN.webkit.messageHandlers[message_id].postMessage({
					method,
					param,
					callback : cb_id && build_trigger_name(cb_id)
				});
			};

		if(cb){
			let cb_id = get_guid();

			check_exists(method, _res=>{
				if(!_res){
					console.warn(`${method} do not exist in external`);

					cb(null, 'NO METHOD');

					return ;
				}

				bind_trigger(cb_id, cb, 'RANDOM');
				_do_external(cb_id);
			});

			return ;
		}

		_do_external();
	};

	const check_exists_name = 'methodExists';

	check_exists = (name, cb)=>{
		if(name === check_exists_name){
			cb(true);

			return ;
		}

		do_external(check_exists_name, {name}, res=>{
			cb(res.exist);
		});
	};
}else{
	// 因为ios 在刷新或使用h5跳转的时候，会存在external加载时机的问题
	let queues = [];

	let _do_external = (...args)=>{
		console.warn('NOT READY');
		queues.push(args);
	};

	let count = -1,
		external_inter,
		check_external = ()=>{
			if(++count > 10){
				_do_external = (method, params, cb)=>{
					console.warn('NOT FOUND EXTERNAL METHOD');

					cb(null, 'NO EXTERNAL');
				};

				clearInterval(external_inter);
			}else{
				try{
					WIN.external.getInitParams();

					clearInterval(external_inter);

					_do_external = (method, params, cb)=>{
						if(!(method in WIN.external)){
							console.warn(`${method} do not exist in external`);

							cb(null, 'NO METHOD');

							return;
						}

						try {
							var client_res = WIN.external[method](...params);

							client_res && (client_res = JSON.parse(client_res));
						}catch(e){
							console.error(e);
						}

						cb(client_res);
					};
				}catch(e){
					return;
				}
			}

			queues.forEach(args=>{
				_do_external(...args);
			});
		};

	external_inter = setInterval(check_external, 66);

	check_external();

	let to_stringify = obj=>obj ? [JSON.stringify(obj)] : [];

	do_external = (..._args)=>{
		let res = check_status(_args, {
			METHOD : _method=>{
				let {method, param, cb} = _method;

				return {
					method,
					param : to_stringify(param),
					cb
				};
			},
			OBJ_PARAM : (method, param, args)=>{
				return {
					method,
					param : to_stringify(param),
					cb : args[0]
				};
			},
			FN_PARAM : (method, param)=>{
				return {
					method,
					param : [],
					cb : param
				};
			},
			ELSE : (method, param, cb)=>{
				return {
					method,
					param : param || [],
					cb
				};
			}
		});

		let {method, param, cb = NOOP} = res;

		_do_external(method, param, cb);
	};

	check_exists = (name, cb)=>{
		cb(name in (WIN.external || {}));
	};
}

/**
 * @exports
 * @namespace
 * @prop {Function}  do_external    - 用于调用客户端方法, 并接受客户端返回
 * @prop {Function}  bind_trigger   - 用于生成监听客户端回掉函数 eg: playAudio  load 等.
 *
 */
let methods = {
	/**
	* 用于调用客户端方法, 并接受客户端返回
	* @global
	* @param {(String | Object)} method  - 要调用方法的名称
	*  @param {String} method.method      - 要调用方法的名称
	*  @param {Object} method.param       - 调用方法所需的参数
	*  @param {Function} method.cb  - 回调函数
	* @param {String | Object} [...param]  - 调用方法所需的参数
	* @param {Function} [ cb ]        - 回调函数
	*
	* @example
	* // 多参数形式  TODO 该方法仅仅适用于兼容老方法。对于wkwebview方法不适合改调用方式。 并且建议以后方法都使用Object来传递
	* do_external('xxx', 'param1', 'param2', ... , ()=>{});
	* @example
	* // 参数Object形式
	* do_external('xxx', {id: 1, name : 'rambo'}, ()=>{});
	* @example
	* // 单参数形式  TODO 使用单参数形式 其中的param 必须为 Object格式
	* do_external({method : 'xxx', param : {a:1, b:2}, cb : ()=>{});
	* @example
	* // 单参数形式 无cb
	* do_external({method : 'xxx', param : {a:1, b:2});
	*/
	do_external,

	/**
	* 用于生成监听客户端回掉函数 eg: playAudio  load 等. http://wiki.17zuoye.net/pages/viewpage.action?pageId=31936626
	* @global
	* @param {String} method          - 要监听方法的名称
	* @param {Function} cb            - 回调函数
	* @param {Boolean} [once = false] - 回调函数
	*
	* @example
	* bind_trigger('load', (...args)=>{
	*     if(args.length === 1){  // 返回就一个值 eg: true || Object
	*
	*     }else{                  // TODO 返回多个值的 返回多个值的 将会以数组形式给予。使用注意。 例如: playAudioProgress 返回的其实是 [url, status, currentTime, duration];
	*
	*     }
	* });
	*
	* @example
	* bind_trigger('load', ()=>{}, once); 只监听一次
	*
	*/
	bind_trigger,

	/**
	* 用于兼容wkwebview 检测某个客户端方法是否存在
	* @global
	* @param {String} name          - 要检测的方法名
	* @param {Function} cb          - 回调函数
	*
	* @return {Boolean} exist       - 是否存在
	*
	* @example
	* check_external('load', (exist)=>{true ? '存在' : '不存在'});
	*/
	check_external : check_exists
};

for(let key in methods){
	if(methods.hasOwnProperty(key)){
		Object.defineProperty(WIN, key, {
			value        : methods[key]
		});
	}
}

export default methods;
export { do_external };
export { bind_trigger };
export { check_exists };

// vim: set ts=4
// vim: set noexpandtab
