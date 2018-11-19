<!--短文朗读-->

<template>
  <div >
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>
    <div class="content-area">

      <div class="v-attr-content">
        <div v-show="showContent" class="v-content-wrap mfont" :class="{ 'listen-content': question.shortTextPlays>0, 'active': smallquestionPlaying }">
          <div class="v-content-text" v-html="subContents[0].content.value"></div>
        </div>
      </div>
    </div>
    <oral-question-footer ref="footer" :question="question" :qindex="qindex" @stopRecord="stopRecord"></oral-question-footer>
  </div>
</template>

<script>
 import Bus from '../../marvel/bus';
 import {startRecord,stopRecord} from '../../utils/record.js';
 import oralMixin from './mixin';
  export default {
    name: 'oral-read',
    'mixins': [ oralMixin ],
    mounted () {
      Bus.curQuestion=this;
      console.log(this.question)
      // 添加指导语2 listenGuide
      this.runArr=['listenGuide','readingTime','playQuestion','wait2Second','listenGuide','playSmallQuestion','readingTimeSmallQuestion','beforeRecord','startRecord','stopRecord','nextQuestion'];
      this.init();

    },

  }
</script>
<style lang="scss" scoped>
  @keyframes text_show {
    0% { opacity: 0; }
    50% { opacity: 0.8; }
    100% { opacity: 1; }
  }
  .content-area {
    position: relative;
    line-height: 1.8;
    padding: 0 15px;
    background: #fff;
    .v-content-text {
      font-family: SFUIDisplay-Regular;
      color: #444444;
      line-height: 27px;
      padding: 14px 0;
      font-size: 15px;
      // font-size: 18px;
    }
    .v-content-wrap {
      animation: text_show .2s ease-in;
    }
    .listen-content {
      padding-left: 30px;
      &.active:before {
        content: "";
        position: absolute;
        left: 15px;
        top: 20px;
        content: "";
        width: 20px;
        height: 16px;
        vertical-align: middle;
        background: url("../../assets/questions/horn-high.gif") no-repeat;
        background-size: contain;
      }
      &.active {
        .v-content-text {
          color: #25A26C;
        }
      }
    }
    .listen-content:before {
      content: "";
      position: absolute;
      left: 15px;
      top: 20px;
      content: "";
      width: 20px;
      height: 16px;
      vertical-align: middle;
      background: url("../../assets/questions/horn-grey.png") no-repeat;
      background-size: contain;
    }
  }
</style>
