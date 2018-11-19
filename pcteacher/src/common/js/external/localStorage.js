/**
 * @author junlin.yan
 * @date 2018/6/11
 * @description 本地存储相关的方法
 */

import {doExternal, hasExternal} from './call';
import {ERROR_CODE} from '../errorCode';

/**
 * 本地存储-存
 *
 * @export
 * @param {string} category
 * @param {string} key
 * @param {Object} value
 * @returns {Object}
 */
export function localStorageSet(category, key, value) {
  category = category || '';
  key = key || '';
  try {
    value = JSON.stringify(value);
  } catch (e) {
    return {
      success: false,
      errCode: ERROR_CODE.LOCAL_STORAGE_ERROR,
      errMsg: e.toString()
    };
  }
  let result = null;

  let _params = {
    category: category,
    key: key,
    value: value
  };
  _params = JSON.stringify(_params);
  if (hasExternal('localStorageSet')) {
    console.log('[call external] localStorageSet----->params: ' + _params);
    doExternal('localStorageSet', _params, function (_result) {
      try {
        _result.errCode = _result.errCode || 0;
        result = _result;
      } catch (e) {
        result = {
          success: false,
          errCode: ERROR_CODE.LOCAL_STORAGE_ERROR,
          errMsg: e.toString()
        };
        console.log('[call external] localStorageSet 返回值解析错误：' + JSON.stringify(result));
      }
    });
  } else {
    key = category + '$' + key;
    window.localStorage.setItem(key, value);
    result = {success: true, errCode: 0, errorMsg: ''};

    console.log('[no external] localStorageSet----->params: ' + _params);
  }
  return result;
}

/**
 * 本地存储-取
 * @param {string} category
 * @param {string} key
 * @returns {Object}
 */
export function localStorageGet(category, key) {
  category = category || '';
  key = key || '';
  let result = null;

  let _params = {
    category: category,
    key: key
  };
  _params = JSON.stringify(_params);
  if (hasExternal('localStorageGet')) {
    console.log('[call external] localStorageGet----->params: ' + _params);
    doExternal('localStorageGet', _params, function (_result) {
      if (_result.success) {
        _result.errCode = _result.errCode || 0;
      }
      result = _result;
    });
  } else {
    key = category + '$' + key;
    let value = window.localStorage.getItem(key);
    result = {success: true, errCode: 0, errorMsg: '', value: value};

    console.log('[no external] localStorageGet----->params: ' + _params);
  }
  let value = result.value || null;
  if (result.success) {
    if (result.value) {
      try {
        value = JSON.parse(value);
        result.value = value;
      } catch (e) {
        result.success = {
          success: false,
          errCode: ERROR_CODE.LOCAL_STORAGE_ERROR,
          errMsg: e.toString(),
          value: null
        };
      }
    }
  }
  return result;
}

/**
 * 本地存储-删
 * @param {string} category
 * @param {string} key
 * @returns {Object}
 */
export function localStorageRemove(category, key) {
  category = category || '';
  key = key || '';
  let result = null;

  let _params = {
    category: category,
    key: key
  };
  _params = JSON.stringify(_params);
  if (hasExternal('localStorageRemove')) {
    console.log('[call external] localStorageRemove----->params: ' + _params);
    doExternal('localStorageRemove', _params, function (_result) {
      result = _result;
    });
  } else {
    key = category + '$' + key;
    window.localStorage.removeItem(key);
    result = {success: true, errCode: 0, errorMsg: ''};

    console.log('[no external] localStorageRemove----->params: ' + _params);
  }
  return result;
}

/**
 * 本地存储-清
 * @param {string} category
 * @returns {Object}
 */
export function localStorageClear(category) {
  category = category || '';
  let result = null;

  let _params = {
    category: category
  };
  _params = JSON.stringify(_params);
  if (hasExternal('localStorageClear')) {
    console.log('[call external] localStorageClear----->params: ' + _params);
    doExternal('localStorageClear', _params, function (_result) {
      result = _result;
    });
  } else {
    let prefix = category + '$';
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      let key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        window.localStorage.removeItem(key);
      }
    }
    result = {success: true, errCode: 0, errorMsg: ''};

    console.log('[no external] localStorageClear----->params: ' + _params);
  }
  return result;
}
