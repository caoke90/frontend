<template>
  <div class="question-main-content main-content-oralbasic-paragraphread clearfix">
    <!--听力材料-->
    <div class="listen-wrapper">
      <div class="listen-file-wrapper">
        <div class="audio-wrapper clearfix">
          <div class="audio-btn" :class="[isPlaying ? 'stop'  : 'play']" @click="clickHandler"></div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="content-container content-container-base">
        <!--内容-->
        <div class="content-detail">
          <div class="content-text">
            <span v-for="(item,index) in audioList" :key="index" class="audio-text"
                  v-html="item.text+'&nbsp;'"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getAudioPlayer} from '../../../common/js/audioPlayer';
  import audioComponent from '../../audio';

  export default {
    name: "oralBasicParagraphRead",
    props: ['question', 'subQuestion', 'qindex'],
    components: {audioComponent},
    data() {
      return {
        isPlaying: false,
        audioPlayer: null,
        currentPlayIndex: 0
      };
    },
    computed: {
      audioList: function () {
        let audioList = this.subQuestion.options || [];
        return audioList;
      },
      isLastAudio: function () {
        let isLastAudio = (this.currentPlayIndex + 1) == this.audioList.length;
        return isLastAudio;
      }
    },
    methods: {
      clickHandler() {
        if (!this.audioPlayer) {
          this.audioPlayer = getAudioPlayer();
        }
        if (this.isPlaying) {
          this.stop();
        } else {
          this.play();
        }
      },
      play() {
        let listenUrl = this.audioList[this.currentPlayIndex].listenUrl;
        this.isPlaying = true;
        let playConfig = {
          url: listenUrl,
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
        this.currentPlayIndex = 0;
      },
      audioEnded() {
        if (this.isLastAudio) {
          this.isPlaying = false;
          console.log('audioEnded');
        } else {
          this.currentPlayIndex++;
          this.play();
          console.log('audioEnded');
        }
      },
      audioError() {
        this.isPlaying = false;
        console.log('audioError');
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .question-container .listen-wrapper {
    margin: 0;
    width: 34px;
    float: left;
  }

  .content-wrapper {
    margin-left: 34px;
  }

  .question-container .question-main-content .content-wrapper .content-detail {
    font-size: 16px;
    color: #555555;
    line-height: 24px;
  }

  .audio-wrapper {
    overflow: hidden;
    width: 30px;
    &.simple-audio {
      display: inline-block;
    }
    .audio-btn {
      float: left;
      width: 24px;
      height: 24px;
      background-repeat: no-repeat;
      background-size: contain;
      &.play {
        background-image: url("../../../assets/img/play.png");
      }
      &.pause {
        background-image: url("../../../assets/img/pause.png");
      }
      &.stop {
        background-image: url("../../../assets/img/stop.png");
      }
    }
  }
</style>
