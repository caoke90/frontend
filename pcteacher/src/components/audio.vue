<script src="../router/index.js"></script>
<template>
  <div v-if="listenUrl" class="audio-wrapper clearfix" :class="{'simple-audio':simpleAudio}">
    <div v-if="!simpleAudio" class="audio-title">听力材料 :</div>
    <div class="audio-btn" :class="[audioBtnState]" @click="clickHandler"></div>
    <div v-if="!simpleAudio" class="audio-play-progress">
      <div class="progress-bar">
        <div class="progress-current" :style="{width:currentProgress+'%'}"></div>
        <div class="listen-time">{{toMinite(playingTime)}}/{{toMinite(listenSeconds)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getAudioPlayer} from '../common/js/audioPlayer';

  export default {
    props: {
      listenUrl: String,
      listenSeconds: {
        type: Number,
        default: 0
      },
      usePaused: {
        type: Boolean,
        default: true
      },
      simpleAudio: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isPlaying: false,
        audioPlayer: null,
        currentProgress: 0
      };
    },
    computed: {
      usePauseState: function () {
        let state = true;
        if (this.simpleAudio) {
          state = false;
        } else {
          state = this.usePaused;
        }
        return state;
      },
      audioBtnState: function () {
        let btnState = 'play';
        if (this.isPlaying) {
          btnState = this.usePauseState ? 'pause' : 'stop';
        }
        return btnState;
      },
      playingTime: function () {
        let time = Math.round(this.currentProgress / 100 * this.listenSeconds);
        if (time >= this.listenSeconds) {
          time = this.listenSeconds;
        }
        return time;
      }
    },
    methods: {
      clickHandler() {
        if (!this.audioPlayer) {
          this.audioPlayer = getAudioPlayer({usePause: this.usePauseState});
        }
        if (this.isPlaying) {
          this.stop();
        } else {
          this.play();
          window.listenUrl = this.listenUrl; //存储一个最后播放的URL 解决题目移除的时候音频播放问题
        }
      },
      play() {
        this.isPlaying = true;
        let playConfig = {
          url: this.listenUrl,
          onStopCallback: () => {
            this.audioStop();
          },
          onEndedCallback: () => {
            this.audioEnded();
          },
          onErrorCallback: () => {
            this.audioError();
          }
        };
        if (!this.simpleAudio) {
          playConfig.onPlayProgressCallback = (param) => {
            let currentProgress = 0;
            if (param && param.duration && ['init', 'stop', 'ended', 'error'].indexOf(param.state) == -1) {
              currentProgress = param.currentTime * 100 / param.duration;
            }
            this.currentProgress = currentProgress;
          }
        }
        setTimeout(() => {
          this.audioPlayer.play(playConfig);
        }, 100);
      },
      stop() {
        this.audioPlayer.stop();
        this.audioStop();
      },
      audioStop() {
        this.isPlaying = false;
        console.log('audioStop');
      },

      audioEnded() {
        this.isPlaying = false;
        this.currentProgress = '100%';
        setTimeout(() => {
          this.currentProgress = 0;
        }, 100);
        console.log('audioEnded');
      },
      audioError() {
        this.isPlaying = false;
        console.log('audioError');
      },
      toMinite(seconds) {
        let m = Math.floor(seconds / 60);
        let s = seconds % 60;
        let mStr = m > 9 ? m : '0' + m;
        let sStr = s > 9 ? s : '0' + s;
        return mStr + ':' + sStr;
      }
    },
    beforeDestroy() {
      if (this.audioPlayer) {
        this.audioPlayer.destroy();
        this.audioPlayer = null;
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .audio-wrapper {
    overflow: hidden;
    height: 24px;
    &.simple-audio {
      display: inline-block;
      position: static;
    }
    .audio-title {
      display: inline-block;
      float: left;
      width: 75px;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      color: #555555;
    }
    .audio-btn {
      cursor: pointer;
      float: left;
      position: relative;
      z-index: 1;
      width: 24px;
      height: 24px;
      background-repeat: no-repeat;
      background-size: contain;
      &.play {
        background-image: url("../assets/img/play.png");
        &:hover {
          background-image: url("../assets/img/play_h.png");
        }
      }
      &.pause {
        background-image: url("../assets/img/pause.png");
        &:hover {
          background-image: url("../assets/img/pause_h.png");
        }
      }
      &.stop {
        background-image: url("../assets/img/stop.png");
        &:hover {
          background-image: url("../assets/img/stop_h.png");
        }
      }
    }
    .audio-play-progress {
      position: relative;
      left: 82px;
      width: 160px;
      height: 100%;
      .progress-bar {
        position: absolute;
        overflow: hidden;
        width: 100%;
        height: 100%;
        background: #F5FBFF;
        border: 1px solid #DBE6EE;
        border-radius: 12px;
        .listen-time {
          z-index: 1;
          position: absolute;
          top: 0;
          margin-left: 40px;
          width: 64px;
          font-size: 12px;
          line-height: 24px;
          color: #555555;
        }
        .progress-current {
          text-align: center;
          height: 100%;
          width: 0;
          opacity: 0.66;
          background: #D7E9FC;
        }
      }
    }
  }
</style>
