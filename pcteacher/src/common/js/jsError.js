/**
 * @author junlin.yan
 * @date 2018/7/12
 * @description 错误处理
 */

import {LOG_LEVEL, errorReport} from './logger';
import {extend, isFunction, noop} from './utils';

/**
 * 错误信息捕获
 * @param {string} msg 错误信息
 * @param {string} url 出错的文件
 * @param {number} line 出错代码的行号
 * @param {number} col 出错代码的列号
 * @param {Object} error 错误的详细信息
 */
function onError(msg, url, line, col, error) {
  setTimeout(function () {
    let time = new Date().getTime();
    col = col || (window.event && window.event.errorCharacter) || 0;

    let msgString = msg.toLowerCase();
    let subString = 'script error';
    if (msgString.indexOf(subString) > -1) {
      msg = 'Script Error: See Browser Console for Detail----->' + msg;
    }

    let detail = {
      file: url,
      line: line,
      col: col,
      time: time,
      error: JSON.stringify(error)
    };
    if (!!error && !!error.stack) {
      // 如果浏览器有堆栈信息，直接使用
      detail.stack = error.stack.toString();
    } else if (onError.callee) {
      // 尝试通过callee拿堆栈信息
      let ext = [];
      let fn = onError.callee.caller;
      let c = 3;
      while (fn && (--c > 0)) {
        ext.push(fn.toString());
        if (fn === fn.caller) {
          break;
        }
        fn = fn.caller;
      }
      ext = ext.join(',');
      detail.stack = ext;
    }
    if (window.history && window.history.state) {
      detail.state = window.history.state;
    }

    let data = {
      msg: msg,
      url: document.location.href,
      detail: detail
    };

    errorReport(data, 'js_error');
  }, 0);
  return false;
}

window.console = window.console || {};
var _consoleError = console.error && isFunction(console.error) ? console.error : noop;

console.error = function (errMsg) {
  let errorArr = [];
  let errorObj = {
    msg: ''
  };
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    if (typeof arg == 'object') {
      errorObj = extend(errorObj, arg);
    } else {
      errorArr.push(arg);
    }
  }
  errorArr.unshift(errorObj.msg);
  let errorMsg = errorArr.join(' ');

  errorObj.msg = errorMsg;
  errorReport(errorObj, 'js_error', LOG_LEVEL.ERROR);

  if (_consoleError && isFunction(_consoleError)) {
    _consoleError.apply(console, arguments);
  }
};
window.onerror = onError;

window.addEventListener('unhandledrejection', function (event) {
  let url, line, col;
  event.reason.stack.replace(/\((.+?):(\d+):(\d+)\)/, function (m, p1, p2, p3) {
    url = p1;
    line = p2;
    col = p3;
  });
  onError(event.reason.message, url, line, col, event.reason.stack);
});
