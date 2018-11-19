/*
* @Author: bin.liu
* @Date:   2018-11-06 16:55:45
* @Last Modified by:   bin.liu
* @Description: 方法统一出口
*/

// JS 统一错误上报
import jsError from './jsError';

// 壳方法汇总
import external from './external';

// 页面渲染延迟回调
import { throttle, debounce } from './throttle';

// 公共方法
import { trim, GUID, getType, voidLabel, getOralType, isEmptyObject, parseCamelCase, underline, calculateTime } from './common';

export default {
    trim,
    GUID,
    getType,
    jsError,
    external,
    throttle,
    debounce,
    voidLabel,
    underline,
    getOralType,
    isEmptyObject,
    parseCamelCase,
    calculateTime
}

