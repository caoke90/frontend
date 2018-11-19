/**
 * @author junlin.yan
 * @date 2018/6/12
 * @description 老师端独有的方法
 *
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=30311912
 */

import {hasExternal, doExternal, bindTrigger} from './call';

/**
 * 错题反馈
 * @param params
 * @param params.question_id 题目id
 */
export function questionFeedback(params) {
  let _params = {
    question_id: params.question_id || ''
  };
  _params = JSON.stringify(_params);
  if (hasExternal('questionFeedback')) {
    doExternal('questionFeedback', _params);
  } else {
    console.log('[no external] questionFeedback----->params: ' + _params);
  }
}

/**
 * H5页面在原生中的跳转
 * @param {Object} params
 * @param {string} params.type: 'autoLoadPage'
 * @param {string} params.params  下一个页面需要的参数
 * @param {string} params.url  链接地址,url必须是https
 * @param {boolean} params.needCart 原生是否显示购题车
 * @param {string} params.title 下一个页面的标题
 */
export function forwardPage(params) {
  let _params = {
    type: params.type || 'autoLoadPage',
    params: params.params || '',
    url: params.url || '',
    title:params.title || '',
    needCart: Boolean(params.needCart)
  };
  _params = JSON.stringify(_params);
  console.log('传给原生的参数----->params: ' + _params);
  if (hasExternal('forwardPage')) {
    doExternal('forwardPage', _params);
  } else {
    console.log('[no external] forwardPage----->params: ' + _params);
  }
}




/**
 * 分享
 * @param {Object} params
 * @param {string} params.title 标题
 * @param {string} params.content  内容
 * @param {string} params.url  链接地址,url必须是https
 * @param {string} params.icon  icon图片，可以为空，默认用本地的
 * 以下参数是老师端才有
 * @param {string} params.messageContent  短信邀请文案
 * @param {number} params.invite 0:分享给学生加入班级 1:分享给家长，快速带学生 2:邀请老师加入
 */
export function shareInfo(params) {
  let _params = {
    title: params.title || '',
    content: params.content || '',
    url: params.url || '',
    icon: params.icon || ''
  };
  if (params.messageContent !== undefined) {
    _params.messageContent = params.messageContent;
  }
  if (params.invite !== undefined) {
    _params.invite = params.invite;
  }
  _params = JSON.stringify(_params);
  if (hasExternal('shareInfo')) {
    doExternal('shareInfo', _params);
  } else {
    console.log('[no external] shareInfo----->params: ' + _params);
  }
}

/**
 * 通用弹框（和native样式一样，就一个确定按钮）
 * @param {string} msg  弹框内容
 */
export function showAlert(msg) {
  msg = msg || '';
  if (hasExternal('showAlert')) {
    doExternal('showAlert', msg);
  } else {
    console.log('[no external] showAlert');
    alert(msg);
  }
}
/*
* 预览新手引导
* */
export function newbieGuide(params) {
    let _params={
        guide_type:params.guide_type || ''
    };
    _params = JSON.stringify(_params);
    if (hasExternal('newbie_guide')) {
        doExternal('newbie_guide', _params);
    } else {
        console.log('[no external] newbie_guide----->params: ' + _params);
    }
}
/**
 * 渲染完成回调H5
 */
export function onFinishRender() {
  if (hasExternal('onFinishRender')) {
    doExternal('onFinishRender');
  } else {
    console.log('[no external] onFinishRender');
  }
}

/**
 * 时间控件
 * @param {Object} params
 * @param {string} params.timestamp 时间戳毫秒, 默认当前时间
 * @param {string} params.min_timestamp 最小时间戳毫秒, 当前时间
 * @param {string} params.max_timestamp 最大时间戳毫秒, 默认无
 */
export function showTimerPicker(params) {
  let _params = '';
  try {
    _params = JSON.stringify(params);
  } catch (e) {
    console.log('[external error] showTimerPicker数据解析失败' + e.toString());
  }
  if (hasExternal('showTimerPicker')) {
    doExternal('showTimerPicker', _params);
  } else {
    console.log('[no external] showTimerPicker----->params: ' + _params);
  }
}

/**
 * 通知老师端首页h5刷新
 */

/*
bindTrigger('refreshData', function () {

});
*/
