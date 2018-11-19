/*与客户端交互模块*/
var WIN = window,
	DOC = window.document,
	get_external =  function(){  // 因为在某些情况 页面刚生成的时候，WIN.external 是一个 undefined
		return 'external' in WIN ? WIN.external : {};
	},
	noop = function(){},
	is_function = function(fn){
		// 只因为不用Object.prototype.toString, 是因为客户端有时候返回的函数并不是 [object Function]
		return typeof fn === 'function' && fn.constructor === Function;
	},
	to_array = function(like_array, slice){
		return Array.prototype.slice.call(like_array, slice || 0);
	},
	USERAGENT = WIN.navigator.userAgent.toLowerCase(),
	body_dom = DOC.body,
	app = 'venus';


// 检查external是否已经加载了某个方法
var checkExternalMethodIsExist = function(methodName){

	var external = get_external(),
		method = external[methodName];

	return is_function(method) && function(){
		return method.apply(external, arguments);
	};

};

var wait_sync = function(condition, fn, timer){
	var do_times = 0,
		_condition,
		_setInterval,
		do_action = function(){
			_condition = condition();

			if(++do_times < 10 && !_condition){
				return;
			}

			clearInterval(_setInterval);

			do_times > 9 ? fn('Fail') : fn(null, _condition);
		};

	_setInterval = setInterval(do_action, timer || 500);

	do_action();
};


var _doExternal = (function(){

	var externalErrorLog = function(errorMsg, logOp){
		//记录原生方法调用失败，throw一个error，让前端报错捕获到，记录到log
		//if(window.__ENV__!='dev'){
			// let client_type = window.globalStore.state.externalInfo.client_type;
			// if(client_type == 'mobile'){
			// 	throw new Error(errorMsg);
			// }
			console.log(errorMsg);
		//}
	};

	var _doExternal = function(methodName){

		var method = checkExternalMethodIsExist(methodName),
			logOp = 'external_' + methodName;
		
		if(!method){
			externalErrorLog('未找到原生提供的 ' + methodName + ' 方法', logOp);
			return null;
		}

		var methodArgs = to_array(arguments, 1),
			result ;
		
		try{
			result = method.apply(null, methodArgs);
		}catch(err){
			externalErrorLog('调用原生 ' + methodName + ' 方法失败', logOp);
		}

		return result;
	};

	_doExternal.async = function(methodName, callback){
		var methodArgs = to_array(arguments, 2);

		is_function(callback) || (callback = noop);

		wait_sync(
			function(){
				return checkExternalMethodIsExist(methodName);
			},
			function(err, method){
				callback(err, err ? undefined : method.apply(null, methodArgs));
			}
		);
	};

	return _doExternal;
})();

export default {
	init(callback, fallback){
		let timmer = null,
			i = 0;
		timmer = setInterval(()=>{
			if('external' in window){
				clearInterval(timmer);
				typeof callback == 'function' && callback();
			}
			else if(i>100){
				typeof fallback == 'function' && fallback();	
			}
			else{
				i++;
			}
		}, 10);
	},
	hasMethod(methodName){
		return checkExternalMethodIsExist(methodName);
	},
	getInitParams(){
		return JSON.parse(_doExternal('getInitParams') || '{}');
	},
	playerAudio(url){
		_doExternal('playAudio', url);
	},
	pauseAudio(url){
		_doExternal('pauseAudio', url);
	},
	registerCallBackFunction(option){
		_doExternal('registerCallBackFunction', JSON.stringify(option));
	},
	showToast(message){
        _doExternal('showToast', message.toString());
	}
}