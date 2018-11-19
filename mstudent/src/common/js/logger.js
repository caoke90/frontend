/**
 * @author junlin.yan
 * @date 2018/6/7
 * @description 打点日志相关
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=12092226
 */

import {extend, isFunction} from './utils';
import {trimURL} from './utils/URLUtils';
import {hasExternal, doExternal} from './external/call';

// 日志等级
export const LOG_LEVEL = {
  EMERG: 0,
  ALERT: 1,
  CRIT: 2,
  ERROR: 3,
  WARNING: 4,
  NOTICE: 5,
  INFO: 6,
  DEBUG: 7
};
const LOG_BASE_URL = '//log.17zuoye.cn';
// const ERROR_REPORT_URL = document.location.protocol + '//' + document.domain;
const ERROR_REPORT_URL = LOG_BASE_URL;

function getCookie(name, defaultValue) {
  let strCookie = document.cookie;
  let arrCookie = strCookie.split('; ');
  for (let i = 0; i < arrCookie.length; i++) {
    let arr = arrCookie[i].split('=');
    if (arr[0] == name) return arr[1];
  }
  return defaultValue;
}

/**
 * 生成日志信息
 * @param {object} logData
 * @returns {*}
 */
function buildLogInfo(logData) {
  logData = logData || {};
  let userId = getCookie('uid', '');
  let appInfo = window.appInfo || {};
  let pathName = window.location.pathname;
  let pathArr = pathName.split('/');
  let appName = appInfo.appName || logData.app || pathArr[1] || '';
  let subject = appInfo.subject || '';
  subject = subject.toUpperCase();
  let env = appInfo.env || '';
  userId = appInfo.userId || userId || '';

  let commonLogInfo = {
    user_agent: window.navigator.userAgent,
    school_type: 'junior',
    html_version: '',
    url: document.location.href || '',
    target: pathName || '',
    app: appName,
    userid: userId,
    subject: subject,
    env: env,
    error_code: '',
    error_type: '',
    detail: '',
    msg: '',
    data_type: ''
  };
  // etc,s0~s4处理
  let etc = logData.etc || {};
  delete logData.etc;
  for (let key in logData) {
    if (!logData.hasOwnProperty(key)) {
      continue;
    }
    if ((key in commonLogInfo) || ['s0', 's1', 's2', 's3', 's4'].indexOf(key) > -1) {
      commonLogInfo[key] = logData[key];
    } else {
      etc[key] = logData[key];
    }
  }
  let logObj = extend(commonLogInfo, {etc: JSON.stringify(etc)});
  return logObj;
}

/**
 * 打点
 * @param {string} module
 * @param {string} op
 * @param {Object} logData
 * @param {Function|null}callback
 * sendLog(module, op, {msg:'',s0:'',s1:'',etc:{}},callback)
 */
export function sendLog(module, op, logData, callback) {
  callback = callback || null;

  let methods = logData.event ? 'sc' : '';
  let logObj = buildLogInfo(logData);
  logObj = extend({module, op}, logObj);
  let logStr = JSON.stringify(logObj);
  console.log('[log_info]: ' + logStr);
  if (hasExternal('log_b')) {
    // TODO 使用新方式错误没找到原因，先使用老的方式调用
    window.external.log_b(methods, logStr);
    // doExternal('log_b', {0: '', 1: logStr});
    if (callback && isFunction(callback)) {
      callback();
    }
  } else {
    let logChhannel = 'vox_logs:17middle_' + logObj.app;
    let logLevel = LOG_LEVEL.INFO;
    let time = new Date().getTime();

    let logParams = {
      _c: logChhannel,
      _l: logLevel,
      _log: encodeURIComponent(logStr),
      _t: time
    };

    let url = LOG_BASE_URL + '/log?';
    Object.keys(logParams).forEach(function (key) {
      url += key + '=' + logParams[key] + '&';
    });
    url = trimURL(url.slice(0, -1));

    let image = new Image();
    if (callback && isFunction(callback)) {
      image.onload = image.onerror = function () {
        callback();
      };
    }

    image.src = url;
  }
}

/**
 * 错误上报
 * @param {string|Object} error
 * @param {string} category
 * @param {string} level
 */
export function errorReport(error, category, level) {
  category = category || 'js_console';

  let logChhannel = 'middle:frontend_error';
  let logLevel = level || LOG_LEVEL.ERROR;

  let reportHost = window.errorReportHost || ERROR_REPORT_URL;

  try {
    if (typeof error != 'object') {
      error = {msg: error};
    }
    if (!error.url) {
      error.url = document.location.href;
    }

    let time = new Date().getTime();
    let logObj = buildLogInfo(error);
    logObj.error_type = category;
    let logStr = JSON.stringify(logObj);

    let logParams = {
      _c: logChhannel,
      _l: logLevel,
      _log: encodeURIComponent(logStr),
      _t: time
    };

    let url = reportHost + '/log?';
    Object.keys(logParams).forEach(function (key) {
      url += key + '=' + logParams[key] + '&';
    });
    url = trimURL(url.slice(0, -1));

    let image = new Image();
    image.src = url;
  } catch (e) {
    console.log('errorReport failed!');
  }
}
