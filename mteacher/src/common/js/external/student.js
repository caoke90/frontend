/**
 * @author junlin.yan
 * @date 2018/6/12
 * @description 学生端独有的方法
 *
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=30311912
 */

import {hasExternal, doExternal} from './call';

/**
 * html加载完成回调
 */
export function homeworkHTMLLoaded() {
  if (hasExternal('homeworkHTMLLoaded')) {
    doExternal('homeworkHTMLLoaded');
  } else {
    console.log('[no external] homeworkHTMLLoaded');
  }
}

/**
 * 开始练习
 */
export function beginhomework() {
  if (hasExternal('beginhomework')) {
    doExternal('beginhomework');
  } else {
    console.log('[no external] beginhomework');
  }
}

/**
 * 完成练习
 */
export function completehomework() {
  if (hasExternal('completehomework')) {
    doExternal('completehomework');
  } else {
    console.log('[no external] completehomework');
  }
}

/**
 * 退出当前练习
 * @param {boolean} isQuit 直接退出当前练习
 * @param {boolean} isSkip 当前练习未完成，直接跳过，进入下一个
 */
export function quitHomework(isQuit, isSkip) {
  if (hasExternal('quitHomework')) {
    doExternal('quitHomework', isQuit, isSkip);
  } else {
    console.log('[no external] quitHomework');
  }
}

/**
 * 设置叉关闭按钮的显示隐藏, 需要配合pageQueueNew或者openFairyLand一起使用
 * @param {boolean} visible 是否可见, 必传
 */
export function setCloseBtnVisible(visible) {
  let _params = {
    visible: Boolean(visible)
  };
  _params = JSON.stringify(_params);
  if (hasExternal('setCloseBtnVisible')) {
    doExternal('setCloseBtnVisible', _params);
  } else {
    console.log('[no external] setCloseBtnVisible----->params: ' + _params);
  }
}

/**
 * 设置物理返回键是否生效（android）
 * @param {boolean} unenable 是否不可用, 必传
 */
export function setBackKeyUnEnable(unenable) {
  let _params = {
    unenable: Boolean(unenable)
  };
  _params = JSON.stringify(_params);
  if (hasExternal('setBackKeyUnEnable')) {
    doExternal('setBackKeyUnEnable', _params);
  } else {
    console.log('[no external] setBackKeyUnEnable----->params: ' + _params);
  }
}

/**
 * 控制手写面板显示隐藏
 */
export function showHandWritingPanel() {
  // TODO 暂未使用
}

/**
 * 设置手势识别内容
 */
export function setHandWritingInfo() {
  // TODO 暂未使用
}

/**
 * 设置通用配置的开关
 */
export function setSettingSwitch() {
  // TODO 暂未使用
}
