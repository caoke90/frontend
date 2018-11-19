/**
 * @author junlin.yan
 * @date 2018/6/15
 * @description 原生回调的方法
 */

import Bus from '../../marvel/bus';
import {onPlayAudioProgress} from './audioPlayer';

window.vox = window.vox || {};
const vox=window.vox;
vox.task || (vox.task = {});

// 原生音频回调
vox.task.playAudioProgress = onPlayAudioProgress;

vox.task.refreshData = function () {
  //Bus.$emit('refreshData', {});
};

window.refreshCart = function () {
  Bus.$emit('refreshCart', {});
};

// 异常退出
vox.task.pauseHTML = function (paused) {
    console.log("[external] callback pauseHTML: " + paused);
    paused = paused === true || paused === "true";
    window.paused = paused;
    // $(vox).trigger("event_pause_html", { paused });
    Bus.$emit('event_pause_html', {paused: paused});
};

// 确定
vox.task.feedbackSave = function () {
    console.log("[external] callback feedbackSave");
    Bus.$emit('event_feedback_save');
}

// 取消
vox.task.feedbackCancel = function () {
    console.log("[external] callback feedbackcancel");
    Bus.$emit('event_feedback_cancel');
}
