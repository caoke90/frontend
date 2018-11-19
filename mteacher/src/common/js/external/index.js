/**
 * @author junlin.yan
 * @date 2018/6/8
 * @description 原生方法封装
 *
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=30311912
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=30311918
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=30311914
 */

import {hasExternal, doExternal} from './call';
import {getQueryParams} from '../utils/URLUtils';
import {extend} from '../utils';

/**
 * 简单判断是否在APP内
 * @returns {boolean}}
 */
export function isSupportExternal() {
  return hasExternal('getInitParams');
}

/** 上一次获取到的初始参数 */
let externalInitParams = null;

/**
 * 获取初始参数
 * @param {boolean}} disableCache 是否禁止缓存（重新获取）
 * @returns {Object}
 *
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=30311912
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=21070216
 */
export function getInitParams(disableCache) {
  disableCache = Boolean(disableCache);
  if (externalInitParams && !disableCache) {
    return externalInitParams;
  }
  let externalParams = null;
  let urlParams = null;

  urlParams = getQueryParams(window.location.href);
  if (urlParams.__p__) {
    let p = urlParams.__p__;
    delete urlParams.__p__;
    try {
      p = JSON.parse(p);
    } catch (e) {
      console.log('[external error] url参数解析失败：' + e.toString());
      p = null;
    }
    urlParams = extend({}, urlParams, p);
  }

  if (hasExternal('getInitParams')) {
    doExternal('getInitParams', function (_initParams) {
      if (typeof _initParams == 'object') {
        _initParams.env = _initParams.server_type;
        externalParams = _initParams;
      } else {
        try {
          externalParams = JSON.parse(_initParams);
        } catch (e) {
          console.log('[external error] getInitParams数据解析失败' + e.toString());
        }
      }
    });

    console.log('[call external] getInitParams----->externalParams: ' + JSON.stringify(externalParams));
  } else {
    // 网页调试设置env参数
    urlParams.env = urlParams.env || 'dev';

    console.log('[no external] getInitParams----->urlParams: ' + JSON.stringify(urlParams));
  }
  let params = extend({}, urlParams, externalParams);
  console.log('[debug info] getInitParams----->result: ' + JSON.stringify(params));
  return params;
}

/**
 * 远程日志
 * @param {string} logStr
 */
export function remoteLog(logStr) {
  logStr = logStr || '';
  if (hasExternal('log_b')) {
    doExternal('log_b', '', logStr);
  } else {
    console.log('[no external] log_b----->params: ' + JSON.stringify({logStr: logStr}));
  }
}

/**
 * 跳转到login界面
 * @param {string} from
 */
export function redirectLogin(from) {
  from = from || '';
  if (hasExternal('redirectLogin')) {
    doExternal('redirectLogin', from);
  } else {
    console.log('[no external] redirectLogin----->params: ' + JSON.stringify({from: from}));
  }
}

/**
 * 更新原生title
 * @param {string} title        显示文本
 * @param {string=} txtColor    文本颜色
 * @param {string=} bgColor     背景颜色
 */
export function updateTitle(title, txtColor, bgColor) {
  title = title || '';
  txtColor = txtColor || '';
  bgColor = bgColor || '';

  let _params = {
    0: title,
    1: txtColor,
    2: bgColor
  };
  if (hasExternal('updateTitle')) {
    // TODO 使用新方式错误没找到原因，先使用老的方式调用
    window.external.updateTitle(title, txtColor, bgColor);
    // doExternal('updateTitle', _params);
  } else {
    _params = JSON.stringify(_params);
    console.log('[no external] updateTitle----->params: ' + _params);
  }
}

/**
 * 浏览图片
 * @param {Array} pictures  图片, {string} desc：图片的说明, {string} title:图片标题, {string} url： url
 * @param {number} index    默认展示索引
 */
export function showPhotoBrowser(pictures, index) {
  pictures = pictures || [];
  index = index || 0;

  pictures.forEach(function (picture) {
    picture.title = picture.title || '';
    picture.desc = picture.desc || '';
  });
  let _params = {
    index: index,
    pictures: pictures
  };
  _params = JSON.stringify(_params);
  if (hasExternal('showPhotoBrowser')) {
    doExternal('showPhotoBrowser', _params);
  } else {
    console.log('[no external] showPhotoBrowser----->params: ' + _params);
  }
}

/**
 * 显示/隐藏拍照组件
 * @param {Object} params
 * @param {boolean} params.show 是否显示, 默认false
 * @param {string} params.photoId 拍照id, 必传唯一表示
 * @param {number} params.photoNum 照片最大数量, 必传
 * @param {boolean} params.uploadUrl 图片上传地址相对路径, 只有学生端
 */
export function showTakePhoto(params) {
  let _params = {
    show: Boolean(params.show),
    photoId: params.photoId || '',
    photoNum: params.photoNum || 1,
    uploadUrl: params.photoNum || ''
  };
  if (!_params.photoId) {
    console.error('[error info] showTakePhoto----->参数错误: ' + JSON.stringify(_params));
    return;
  }
  _params = JSON.stringify(_params);
  if (hasExternal('showTakePhoto')) {
    doExternal('showTakePhoto', _params);
  } else {
    console.log('[no external] showTakePhoto----->params: ' + _params);
  }
}

/**
 * 弹出Toast
 * @param {string} msg
 */
export function showToast(msg) {
  if (msg instanceof Object) {
    msg = JSON.stringify(msg);
  }
  if (hasExternal('showToast')) {
    doExternal('showToast', msg);
  } else {
    console.log('[no external] showToast----->params: ' + JSON.stringify({msg: msg}));
  }
}

/**
 * Loading框
 * @param {boolean} show            是否显示
 * @param {string=""} content       显示的文本
 */
export function showLoading(show, content) {
  let _params = JSON.stringify({
    show: Boolean(show),
    content: content || ''
  });
  if (hasExternal('showLoading')) {
    doExternal('showLoading', _params);
  } else {
    console.log('[no external] showLoading----->params: ' + _params);
  }
}

/**
 * 新的Loading 加载框
 * @param {string} content           显示文案, 必传（fullscreen为true的时候不起作用）
 * @param {boolean} fullscreen       是否显示全屏的白色loading, 默认是黑色的Dialog 样式的
 */
export function showLoadingView(content, fullscreen) {
  let _params = JSON.stringify({
    content: content || '',
    fullscreen: Boolean(fullscreen)
  });
  if (hasExternal('showLoadingView')) {
    doExternal('showLoadingView', _params);
  } else {
    console.log('[no external] showLoadingView----->params: ' + _params);
  }
}

/**
 * 关闭loading
 */
export function closeLoading() {
  let _params = '';
  if (hasExternal('closeLoading')) {
    doExternal('closeLoading', _params);
  } else {
    console.log('[no external] closeLoading----->params: ' + _params);
  }
}

/**
 * 打开新的webview
 * @param {Object} params
 * @param {string} params.url 打开的地址, 必传
 * @param {boolean} params.page_close 是否关闭当前页, 默认true
 * @param {Object} params.headers 头信息
 * @param {string} params.useNewCore 使用内核, 默认不传为system
 * @param {Object} params.params 新页面参数, 可以通过getInitParams获取
 */
export function openSecondWebview(params) {
  let _params = {
    url: params.url || ''
  };

  if (params.page_close !== undefined) {
    _params.page_close = Boolean(params.page_close);
  }
  if (params.headers !== undefined) {
    let headers = params.headers;
    if (typeof headers == 'object') {
      try {
        headers = JSON.stringify(headers);
        _params.headers = headers;
      } catch (e) {
        console.log('[error info] openSecondWebview----->headers解析错误');
      }
    }
  }
  if (params.useNewCore !== undefined) {
    _params.useNewCore = params.useNewCore;
  }
  if (params.params !== undefined) {
    let _initParams = params.params;
    if (typeof _initParams == 'object') {
      try {
        _initParams = JSON.stringify(_initParams);
        _params.params = _initParams;
      } catch (e) {
        console.log('[error info] openSecondWebview----->params解析错误');
      }
    }
  }
  _params = JSON.stringify(_params);
  if (hasExternal('openSecondWebview')) {
    doExternal('openSecondWebview', _params);
  } else {
    console.log('[no external] openSecondWebview----->params: ' + _params);
  }
}

/**
 * 关闭webview
 */
export function disMissView() {
  if (hasExternal('disMissView')) {
    doExternal('disMissView');
  } else {
    console.log('[no external] disMissView');
    // window.close();
    alert('已经正常退出到外壳');
  }
}

/**
 * 设置webview顶部栏信息
 * @param {Object} params
 * @param {boolean} params.show 显示顶部栏
 * @param {boolean} params.needCart 原生是否显示购题车
 * @param {string} params.rightText 顶部右侧按钮文案
 * @param {string} params.rightTextColor 右侧按钮文案颜色
 * @param {string} params.nextAction 右侧按钮点击后跳转地址
 * @param {string} params.rightImage 右侧按钮图片地址
 * @param {boolean} params.needCallBack 右侧按钮点击后是否回调
 */
export function setTopBarInfo(params) {
  let _params = {
    show: Boolean(params.show),
    needCart:Boolean(params.needCart)
  };
  if (params.rightText !== undefined) {
    _params.rightText = params.rightText;
  }
  if (params.rightTextColor !== undefined) {
    _params.rightTextColor = params.rightTextColor;
  }
  if (params.nextAction !== undefined) {
    _params.nextAction = params.nextAction;
  }

  if (params.rightImage !== undefined) {
    _params.rightImage = params.rightImage;
  }
  if (params.needCallBack !== undefined) {
    _params.needCallBack = Boolean(params.needCallBack);
  }

  _params = JSON.stringify(_params);
  console.log('传给原生的参数----->params: ' + _params);
  if (hasExternal('setTopBarInfo')) {
    doExternal('setTopBarInfo', _params);
  } else {
    console.log('[no external] setTopBarInfo----->params: ' + params);
  }
}

/**
 * 打点时长统计
 * @param {Object} params
 * @param {string} params.type 显示顶部栏
 * @param {string} params.pageId 页面标识
 * @param {string} params.productId 模考id
 * @param {string} params.etc 额外参数
 */
export function timeStatistics(params) {
  let _params = {
    type: params.type,
    pageId: params.pageId,
    productId: params.productId
  };

  if (params.etc !== undefined) {
    let etc = params.etc;
    if (typeof etc == 'object') {
      try {
        etc = JSON.stringify(etc);
        _params.etc = etc;
      } catch (e) {
        console.log('[error info] timeStatistics----->params解析错误');
      }
    }
  }
  _params = JSON.stringify(_params);
  if (hasExternal('timeStatistics')) {
    doExternal('timeStatistics', _params);
  } else {
    console.log('[no external] timeStatistics----->params: ' + params);
  }
}

/**
 * 调用壳弹窗
 * @param {Object} params
 * @param {string} params.confirmOnQuit 退出时是否显示对话框
 * @param {string} params.confirmOnQuitMsg 对话框的msg
 */

export function externalConfig(params) {
  let _params = {
    confirmOnQuit: params.confirmOnQuit,
    confirmOnQuitMsg: params.confirmOnQuitMsg,
    confirmLeftTxt: params.confirmLeftTxt,
    confirmRightTxt: params.confirmRightTxt,
    confirmLeftNeedCallBack: params.confirmLeftNeedCallBack,
    confirmRightNeedCallBack: params.confirmRightNeedCallBack
  };

  _params = JSON.stringify(_params);
  if (hasExternal('externalConfig')) {
    doExternal('externalConfig', _params);
  } else {
    console.log('[no external] timeStatistics----->params: ' + params);
  }
}


