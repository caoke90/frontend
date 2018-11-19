/**
 * @author junlin.yan
 * @date 2018/6/8
 * @description Test file template
 */

import clientPlugin from '17zy_jxt_client_plugin';

/**
 * 检测某个客户端方法是否存在
 * @global
 * @param {string} method          - 要检测的方法名
 * @return {boolean}} exist       - 是否存在
 */
export function hasExternal(method) {
  let isExists = false;

  clientPlugin.check_external(method, function (exists) {
    isExists = exists;
  });
  if (!isExists) {
    console.log('原生方法 [' + method + '] 不存在');
  }
  return isExists;
}

/**
 * 执行某个客户端方法
 * @param {(String | Object)} method  - 要调用方法的名称
 *  @param {string} method.method      - 要调用方法的名称
 *  @param {Object} method.param       - 调用方法所需的参数
 *  @param {Function} method.cb  - 回调函数
 * @param {String | Object} [...param]  - 调用方法所需的参数
 * @param {Function} [ cb ]        - 回调函数
 * @returns {*}
 *
 * @example
 * // 参数Object形式
 * do_external('xxx', {id: 1, name : 'rambo'}, ()=>{});
 */
export function doExternal(method, ...args) {
  return clientPlugin.do_external(method, ...args);
}

/**
 * 用于生成监听客户端回调函数 eg: playAudio  load 等
 * @param {string} method          - 要监听方法的名称
 * @param {Function} cb            - 回调函数
 * @param {boolean}} [once = false] - 只监听一次
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=31936626
 */
export function bindTrigger(method, cb, once) {
  console.log('trigger回调 [' + method + ']');
  clientPlugin.bind_trigger(method, cb, once);
}

export default {hasExternal, doExternal, bindTrigger};
