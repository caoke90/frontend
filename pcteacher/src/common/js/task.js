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
  // Bus.$emit('refreshData', {});
};

window.refreshCart = function () {
  Bus.$emit('refreshCart', {});
};
