/**
 * @author junlin.yan
 * @date 2018/6/8
 * @description 音频相关方法封装
 */

import {hasExternal, doExternal} from './call';

/**
 * 下载音频
 * @param {string} url
 */
export function loadAudio(url) {
  if (hasExternal('loadAudio')) {
    doExternal('loadAudio', url);
  } else {
    console.log('[no external] loadAudio----->params: ' + url);
  }
}

/**
 * 播放音频
 * @param {string} url
 */
export function playAudio(url) {
  if (hasExternal('playAudio')) {
    doExternal('playAudio', url);
  } else {
    console.log('[no external] playAudio----->params: ' + url);
  }
}

/**
 * 移动播放进度到指定位置
 * @param {string} url      url
 * @param {number} time     跳转位置(s)
 */
export function seekAudio(url, time) {
  let _params = JSON.stringify({
    url: url,
    time: time
  });
  if (hasExternal('seekAudio')) {
    doExternal('seekAudio', _params);
  } else {
    console.log('[no external] seekAudio----->params: ' + _params);
  }
}

/**
 * 暂停音频
 * @param {string} url
 */
export function pauseAudio(url) {
  if (hasExternal('pauseAudio')) {
    doExternal('pauseAudio', url);
  } else {
    console.log('[no external] pauseAudio----->params: ' + url);
  }
}

/**
 * 停止播放音频
 * @param {string} url
 */
export function stopAudio(url) {
  if (hasExternal('stopAudio')) {
    doExternal('stopAudio', url);
  } else {
    console.log('[no external] stopAudio----->params: ' + url);
  }
}

/**
 * 播放音频(支持多个音频播发)
 * @param {string} url   音频地址
 * @param {boolean}} isLoop    循环播放
 * @param {boolean}} isStopPre 停止前一个音频
 * @param {boolean}} isLoop    循环播放
 * @param {number} volume    音量大小（0.0-1.0）0为静音, -1使用当前音量
 */
export function playAudioControl(url, isLoop, isStopPre, volume) {
  let _params = JSON.stringify({
    url: url,
    isStopPre: Boolean(isStopPre),
    isLoop: Boolean(isLoop),
    volume: volume === undefined ? -1 : volume
  });
  if (hasExternal('playAudioControl')) {
    doExternal('playAudioControl', _params);
  } else {
    console.log('[no external] playAudioControl----->params: ' + _params);
  }
}
