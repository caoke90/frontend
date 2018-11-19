<template>
  <div v-if="listenUrl" class="audio-wrapper clearfix" :class="{'simple-audio':simpleAudio}">
    <div class="audio-btn" :class="[audioBtnState]" @click="clickHandler"></div>
    <div v-if="!simpleAudio" class="audio-play-progress">
      <div class="progress-bar">
        <div class="progress-current" :style="{width:currentProgress}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getAudioPlayer} from '../common/js/audioPlayer';

  export default {
    props: {
      listenUrl: String,
      simpleAudio: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isPlaying: false,
        audioPlayer: null,
        currentProgress: 0,
      };
    },
    computed: {
      audioBtnState: function () {
        let btnState = 'play';
        if (this.isPlaying) {
          btnState = this.simpleAudio ? 'stop' : 'pause';
        }
        return btnState;
      }
    },
    methods: {
      clickHandler() {
        if (!this.audioPlayer) {
          this.audioPlayer = getAudioPlayer({usePause: !this.simpleAudio});
        }
        if (this.isPlaying) {
          this.stop();
        }
        else {
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
            this.currentProgress = currentProgress + '%';
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
      }
    },
    created: function (){

    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .audio-wrapper {
    overflow: hidden;
    height: 0.44rem;
    &.simple-audio {
      display: inline-block;
    }
    .audio-btn {
      float: left;
      width: 0.44rem;
      height: 0.44rem;
      background-repeat: no-repeat;
      background-size: contain;
      &.play {
        background-image: url("../assets/img/play.png");
      }
      &.pause {
        background-image: url("../assets/img/pause.png");
      }
      &.stop {
        background-image: url("../assets/img/stop.png");
      }
    }
    .audio-play-progress {
      margin-left: 0.64rem;
      padding-top: 0.16rem;
      height: 100%;
      .progress-bar {
        overflow: hidden;
        height: 0.10rem;
        background: #F2F8FF;
        border-radius: 8px;
        .progress-current {
          height: 100%;
          width: 0;
          background: #007AFF;
          border-radius: 8px;
        }
      }
    }
  }
</style>
