/**
 * @author junlin.yan
 * @date 2018/6/12
 * @description 音频
 */

import {getGUID, noop, extend} from './utils';
import * as audioExternal from './external/audio';
import {isSupportExternal} from './external';

// 播放状态, stop状态只有老师端支持, 现在学生端和家长通停止时也回调的ended
const audioStatus = {
  Init: 'init',
  Playing: 'playing',
  Paused: 'paused',
  Stop: 'stop',
  Ended: 'ended',
  Error: 'error'
};

// 默认的音频错误代码
const audioErrorCode = 30301;

// 存放audioPlayer实例
var audioList = [];

/**
 * 转换播放状态
 * @param stateCode
 * @returns {*}
 */
function parsePlayState(stateCode) {
  let state = stateCode;
  let errCode = 0;
  let errMsg = '';

  switch (stateCode) {
    case 'init':
    case 'playing':
    case 'paused':
    case 'stop':
    case 'ended':
      state = stateCode;
      break;
    case 'error':
      state = stateCode;
      errCode = audioErrorCode;
      errMsg = '音频播放错误';
      break;
    default:
      state = 'error';
      errCode = parseInt(stateCode, 10);
      errMsg = '音频播放错误';
      if (!(errCode > 0)) {
        errCode = audioErrorCode;
      }
      break;
  }
  return {state, errCode, errMsg};
}

/**
 * 音频播放进度
 * @param {string} url 音频地址
 * @param {string} state "init"=初始, "playing"=播放中, "paused"=暂停, "ended"=播放完毕, "error"=errorCode
 * @param {number} currentTime 当前时长（秒）
 * @param {number} duration 总时长（秒）
 */
export function onPlayAudioProgress(url, state, currentTime, duration) {
  for (let id in audioList) {
    let audio = audioList[id];
    if (!audio) {
      delete audioList[id];
      continue;
    }
    if (audio.url === url) {
      state = audio.isStop && audio.state == 'ended' ? 'stop' : state;
      let stateParams = parsePlayState(state);
      let params = extend({url, currentTime, duration}, stateParams);

      audio.updatePlayProgress(params);
    }
  }
}

/**
 * 音频错误处理
 * @param {string} url   音频地址
 * @param {string} state   播放状态
 * @param {number} errCode  错误代码
 * @param {string} errMsg   错误信息
 */
function audioErrorHandler({url, state, errCode, errMsg}) {
  let tempErrText = errMsg || '音频播放错误';
  let tempErrCode = errCode || audioErrorCode;
  switch (tempErrCode) {
    case '30100':
    case '30101':
    case '30102':
    case '30103':
    case '30104':
    case '30105':
    case '30106':
    case '30107':
      tempErrText = `下载音频错误(${tempErrCode})`;
      break;
    case '30300':
    case '30301':
    case '30302':
    case '30303':
      tempErrText = `播放音频异常(${tempErrCode})`;
      break;
    default:
      tempErrText = `播放音频错误(${tempErrCode})`;
      break;
  }
  return {url, state, errCode: tempErrCode, errMsg: tempErrText};
}

/**
 * 停止播放当前所有声音
 */
export function stopAllAudio() {

  for (let id in audioList) {
    let audio = audioList[id];
    if (audio) {
      audio.stop();
    }
  }
}

class BaseAudio {
  constructor({id, audio, usePause}) {
    // id
    this.id = id || '';
    // h5的Audio播放
    this.audio = audio || null;
    // 区分调用stop时用stopAudio还是pauseAudio
    this.usePause = Boolean(usePause) || false;

    // 音频地址
    this.url = null;
    // 播放状态
    this.playState = audioStatus.Ended;
    // 音频长度（s）
    this.duration = 0;
    // 当前缓冲时间（s）
    this.bufferedTime = 0;
    // 当前播放时间（s）
    this.currentTime = 0;

    // play progress回调
    this.onPlayProgressCallback = null;
    // play pause | stop回调
    this.onStopCallback = null;
    // play ended回调
    this.onEndedCallback = null;
    // play error回调
    this.onErrorCallback = null;

    // 兼容原生的stop状态，用于区分停止和播放完毕，执行停止是设为true，收到stop或ended事件后重置为false
    this.isStop = false;

    // 兼容H5的stop状态，用于区分停止和暂停，执行暂停是设为true，收到pause事件后重置为false
    this.isPaused = false;

    this.addToGlobal();
  }

  /**
   * 是否正在播放音频，将init和playing都当做播放，防止在load视频时调用stop不生效
   * @returns {boolean}
   */
  isPlaying() {
    if ([audioStatus.Init, audioStatus.Playing].indexOf(this.playState) >= 1) {
      return true;
    }
    return false;
  }

  /**
   * 添加到全局记录
   */
  addToGlobal() {
    audioList[this.id] = this;
    console.log("音频实例", audioList);
  }

  /**
   * 移除出全局记录
   */
  removeFromGlobal() {
    delete audioList[this.id];
  }

  /**
   * 播放
   */
  playAudio({url, onStopCallback, onEndedCallback, onErrorCallback, onPlayProgressCallback} = {}) {
    this.playState = audioStatus.Init;

    this.url = url || '';
    this.onStopCallback = onStopCallback || noop;
    this.onEndedCallback = onEndedCallback || noop;
    this.onErrorCallback = onErrorCallback || noop;
    this.onPlayProgressCallback = onPlayProgressCallback || noop;

    this.log('playAudio');
  }

  /**
   * 暂停
   */
  pauseAudio() {
    this.log('pausedAudio');
  }

  /**
   * 继续
   */
  continuePlayAudio() {
    this.log('continuePlayAudio');
  }

  /**
   * 停止
   */
  stopAudio() {
    this.log('stopAudio');
  }

  play() {
    stopAllAudio();
    setTimeout(() => {
      if (this.usePause && this.playState == audioStatus.Paused) {
        this.continuePlayAudio();
      } else {
        this.playAudio.apply(this, arguments);
      }
    }, 100);
  }

  stop() {
    if ([audioStatus.Paused, audioStatus.Stop, audioStatus.Ended].indexOf(this.playState) == -1) {
      if (this.usePause) {
        this.pauseAudio();
      } else {
        this.stopAudio();
      }
    }
  }

  /**
   * 改变播放进度
   * @param {number} time     跳转位置, 百分百换算的小数
   */
  seekAudio(time) {
    this.log('seekAudio');
  }

  /**
   * 更新播放进度及状态
   * @param {string} url  音频地址
   * @param {string} state    init=初始, playing=播放中, paused=暂停, ended=播放完毕, error=播放错误
   * @param {number} currentTime 当前时长（秒）
   * @param {number} duration 总时长（秒）
   * @param {number} errCode  错误代码，state为error时才有
   * @param {number} errMsg   错误信息，state为error时才有
   */
  updatePlayProgress({url, state, currentTime, duration, errCode, errMsg}) {
    this.log(JSON.stringify({url, state, currentTime, duration, errCode, errMsg}));
    this.log('playState: ' + this.playState + '----->' + state);

    if (this.audio) {
      currentTime = this.audio.currentTime;
      duration = this.audio.duration;
    }

    if ([audioStatus.Stop, audioStatus.Ended, audioStatus.Error].indexOf(state) > -1) {
      currentTime = 0;
    } else if ([audioStatus.Init, audioStatus.Paused].indexOf(state) > -1 || (state == audioStatus.Playing && this.playState != audioStatus.Playing)) {
      currentTime = this.currentTime;
    }
    if ([audioStatus.Init, audioStatus.Paused].indexOf(state) > -1) {
      duration = this.duration;
    }
    if (state == audioStatus.Playing && duration == 0) {
      currentTime = this.currentTime;
      duration = this.duration;
    }

    if (!(isFinite(currentTime) && currentTime > 0)) {
      currentTime = 0;
    }
    if (!(isFinite(duration) && duration > 0)) {
      duration = 0;
    }
    switch (state) {
      case 'init':
        this.onInit({url, state, currentTime, duration});
        break;
      case 'playing':
        this.onPlaying({url, state, currentTime, duration});
        break;
      case 'paused':
        if ([audioStatus.Init, audioStatus.Playing].indexOf(this.playState) > -1) {
          this.onPaused({url, state, currentTime, duration});
        }
        break;
      case 'stop':
        if ([audioStatus.Init, audioStatus.Playing, audioStatus.Paused].indexOf(this.playState) > -1) {
          this.onStop({url, state, currentTime, duration});
        }
        break;
      case 'ended':
        if (this.playState == audioStatus.Playing) {
          this.onEnded({url, state, currentTime, duration});
        }
        break;
      case 'error':
        let errInfo = audioErrorHandler({url, state, errCode, errMsg});
        this.onError(errInfo);
        break;
      default:
        break;
    }
    this.onPlayProgress({url, state, currentTime, duration});
  }

  log(msg) {
    console.log(`[audioPlayer debug] ${this.id} (${this.url}) ${msg}`);
  }

  onInit({url, state, currentTime, duration}) {
    this.log('onInit');
    this.duration = duration || 0;
    this.currentTime = currentTime || 0;
  }

  onPlaying({url, state, currentTime, duration}) {
    this.log('onPlaying');
    this.playState = audioStatus.Playing;
    this.currentTime = currentTime || 0;
    this.duration = duration || 0;
  }

  onPaused({url, state, currentTime, duration}) {
    this.log('onPaused');
    this.playState = audioStatus.Paused;
    this.onStopCallback({url, state, currentTime, duration});
  }

  onStop({url, state, currentTime, duration}) {
    this.log('onStop');
    this.playState = audioStatus.Ended;
    this.currentTime = 0;
    if (this.isStop) {
      this.isStop = false;
    }
    if (this.playState != audioStatus.Paused) {
      this.onStopCallback({url, state, currentTime, duration});
    }
  }

  onEnded({url, state, currentTime, duration}) {
    this.log('onEnded');
    this.playState = audioStatus.Ended;
    this.currentTime = 0;
    this.onEndedCallback({url, state, currentTime, duration});
  }

  onError({url, state, errCode, errMsg}) {
    this.log('onError');
    this.playState = audioStatus.Ended;
    this.currentTime = 0;
    this.onErrorCallback({url, state, errCode, errMsg});
  }

  /**
   * 更新播放进度
   * @param {string} state
   * @param {number} currentTime
   * @param {number} duration
   * @param {string=null} errCode
   * @param {string=null} errMsg
   */
  onPlayProgress({state, currentTime, duration}) {
    this.onPlayProgressCallback({state, currentTime, duration});
  }

  /**
   * 销毁
   */
  destroy() {
    this.stopAudio();
    this.log('destroy');
    this.removeFromGlobal();
  }
}

class ExternalAudio extends BaseAudio {
  constructor({usePause} = {}) {
    let id = getGUID('externalAudio');
    super({id, usePause});
  }

  playAudio({url, onStopCallback, onEndedCallback, onErrorCallback, onPlayProgressCallback} = {}) {
    /*    super.playAudio({
          url,
          onStopCallback,
          onEndedCallback,
          onErrorCallback,
          onPlayProgressCallback
        });*/
    super.playAudio.apply(this, arguments);
    if (!url) {
      this.log('音频url为空');
      this.onError({url: this.url, state: 'error', errCode: audioErrorCode, errMsg: '音频url为空'});
      return;
    }
    audioExternal.playAudio(url);
  }

  pauseAudio() {
    super.pauseAudio();
    switch (this.playState) {
      case 'init':
      case 'playing':
        this.log('pause');
        audioExternal.pauseAudio(this.url);
        break;

      default:
        break;
    }
  }

  continuePlayAudio() {
    super.continuePlayAudio();
    switch (this.playState) {
      case 'paused':
        this.log('continue');
        audioExternal.playAudio(this.url);
        break;

      default:
        break;
    }
  }

  stopAudio() {
    super.stopAudio();
    switch (this.playState) {
      case 'init':
      case 'playing':
        this.log('stop');
        this.isStop = true;
        audioExternal.stopAudio(this.url);
        break;

      default:
        break;
    }
  }

  seekAudio(progress) {
    super.seekAudio(progress);
    switch (this.playState) {
      case 'init':
      case 'playing':
      case 'paused':
      case 'ended':
        this.log('seek');
        if (!(this.duration > 0)) return;
        if (!(progress >= 0)) {
          progress = 0;
        }
        if (!(progress <= 1)) {
          progress = 1;
        }

        let currentTime = this.duration * progress;
        audioExternal.seekAudio(this.url, currentTime);
        break;

      default:
    }
  }
}

class H5Audio extends BaseAudio {
  constructor({usePause} = {}) {
    let id = getGUID('h5Audio');
    let audio = new Audio();
    super({id, audio, usePause});

    this.audio.addEventListener('canplay', function () {
      let currentTime = this.audio.currentTime;
      let duration = this.audio.duration;
      let state = 'init';
      this.updatePlayProgress({url: this.url, state, currentTime, duration});
    }.bind(this));
    this.audio.addEventListener('timeupdate', function () {
      let currentTime = this.audio.currentTime;
      let duration = this.audio.duration;
      let state = 'playing';
      this.updatePlayProgress({url: this.url, state, currentTime, duration});
    }.bind(this));
    this.audio.addEventListener('pause', function () {
      let currentTime = this.audio.currentTime;
      let duration = this.audio.duration;
      if (this.isPaused) {
        let state = 'paused';
        this.updatePlayProgress({url: this.url, state, currentTime, duration});
        this.isPaused = false;
      } else {
        if (currentTime == duration) {
          // 这是播放完毕收到的pause
          return;
        }
        let state = 'stop';
        this.updatePlayProgress({url: this.url, state, currentTime: 0, duration});
      }
    }.bind(this));
    this.audio.addEventListener('ended', function () {
      let currentTime = this.audio.currentTime;
      let duration = this.audio.duration;
      let state = 'ended';
      this.updatePlayProgress({url: this.url, state, currentTime, duration});
    }.bind(this), 0);

    this.audio.addEventListener('error', function () {
      let state = 'error';
      this.updatePlayProgress({url: this.url, state, errCode: audioErrorCode});
    }.bind(this));
  }

  playAudio({url, onStopCallback, onEndedCallback, onErrorCallback, onPlayProgressCallback} = {}) {
    /*    super.playAudio({
          url,
          onStopCallback,
          onEndedCallback,
          onErrorCallback,
          onPlayProgressCallback
        });*/
    super.playAudio.apply(this, arguments);
    if (!url) {
      this.log('音频url为空');
      this.onError({url: this.url, state: 'error', errCode: audioErrorCode, errMsg: '音频url为空'});
      return;
    }
    this.audio.src = url;
    this.audio.play();
  }

  pauseAudio() {
    super.pauseAudio();
    switch (this.playState) {
      case 'init':
      case 'playing':
        this.log('pause');
        this.isPaused = true;
        this.audio.pause();
        break;

      default:
        break;
    }
  }

  continuePlayAudio() {
    super.continuePlayAudio();
    switch (this.playState) {
      case 'paused':
        this.log('continue');
        this.audio.play();
        break;

      default:
        break;
    }
  }

  stopAudio() {
    switch (this.playState) {
      case 'init':
      case 'playing':
        super.stopAudio();
        this.log('stop');
        this.audio.pause();
        break;

      default:
        break;
    }
  }

  seekAudio(progress) {
    super.seekAudio(progress);
    switch (this.playState) {
      case 'init':
      case 'playing':
      case 'paused':
      case 'ended':
        this.log('seek');
        let duration = this.audio.duration;
        if (isFinite(duration) && duration >= 0) {
          if (!(progress >= 0)) progress = 0;
          if (!(progress <= 1)) progress = 1;
          this.audio.currentTime = progress * duration;
        }
        break;
      default:
        break;
    }
  }
}

export function getAudioPlayer({usePause} = {}) {
  let AudioPlayer = isSupportExternal() ? ExternalAudio : H5Audio;
  return new AudioPlayer({usePause});
}
