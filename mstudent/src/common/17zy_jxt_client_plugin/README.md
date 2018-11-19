### 作用
因为我们未来将会在ios上使用`wkwebview`，因此大家在跟客户端交互的时候，就会造成选择困惑。
该库的作用就是给大家消除困惑，跟客户端沟通更为愉快

### 该库的特征
* 该库是默认是使用 `ES6` 模块系统。
* 默认情况该库会向`window`增加两个方法 **do_external** **bind_trigger** **check_external**
* 无任何模块依赖

### 方法简介
```javascript
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
		*     }else{                  // 返回多个值的 url, currentSrc
		*
		*     }
		* });
		*
		* @example
		* bind_trigger('load', ()=>{}, once); 只监听一次
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
```

### 注意事项
* ios在使用external方法时，以下情况会存在延迟问题
	- 刷新 包括location.reload();
	- h5跳转 包括 href   location.href

  **因此： 敲黑板了** 如果有需要在页面一进来就调用某个方法，建议使用`回调函数`形式调用

* `bind_trigger` 返回参数有可能会是多参数, 为了兼容**老版本**, 当是多参数时，客户端将会以数组给出。具体顺序 以及代表的含义视具体方法 具体定义。 前端在接受参数的就当成**往常的多参数函数**接受就行

* 为了向前看起 向前兼容。 我更建议大家都使用 `回调函数` + `Object参数` 形式。 **未来客户端新方法都将会使用JSON格式的参数**
	```javascript
		do_external('playAudio', {src : 'xx'}, ()=>{});
	```
