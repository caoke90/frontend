<!--信息转述-->

<template>
  <div id="oral_q" class="common-panel">
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>
    <div class="content-area">
      <div class="v-attr-content">
        <div v-show="showContent && subContents[0].content.value" class="v-content-wrap mfont" :class="{ 'listen-content': smallquestionPlaying }">
          <div class="v-content-text" v-html="subContents[0].content.value"></div>
        </div>
      </div>
    </div>
    <oral-question-footer ref="footer" :question="question" :qindex="qindex"  @stopRecord="stopRecord"></oral-question-footer>
  </div>
</template>

<script>
  import Bus from '../../marvel/bus';
  import {startRecord,stopRecord} from '../../utils/record.js';
  import oralMixin from './mixin';
  export default {

    'name': 'oral-quoted',
    'mixins': [ oralMixin ],
    mounted () {
      Bus.curQuestion=this;
      console.log(this.question)
      // 数据兼容
      this.question.listenUrl=this.question.listenUrl||this.question.subQuestion[0].listenFileUrl;
      this.question.listenSeconds=this.question.listenSeconds||this.question.subQuestion[0].listenSeconds;

      this.question.subQuestion[0].listenFileUrl='';
      this.question.subQuestion[0].listenSeconds=0;
      // 默认主流程
      this.runArr=['listenGuide','readingTime','listenGuide','playQuestion','wait2Second','listenGuide','playSmallQuestion','readingTimeSmallQuestion','beforeRecord','startRecord','stopRecord','nextQuestion']
      this.init()

    },
  }
</script>
<style lang="scss" >
  @keyframes text_show {
    0% { opacity: 0; }
    50% { opacity: 0.8; }
    100% { opacity: 1; }
  }
  #oral_q {
    padding: 0 !important;
    .content-area{
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
        table {
          max-width: 100% !important;
          width: 100% !important;
        }
      }
      .v-content-wrap {
        animation: text_show .2s ease-in;
      }
    }
  }
</style>

