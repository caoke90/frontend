<!--回答问题-->

<template>
  <div id="OralSituationalQAnswer" class="common-panel">
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>

    <div class="content-area">
      <div class="v-attr-content">
        <div v-show="showContent && subContents[0].content.value" class="v-content-wrap mfont">
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

    'name': 'oral-expression',
    'mixins': [ oralMixin ],
    mounted () {
      Bus.curQuestion=this;
      console.log(this.question)
      // 数据兼容
      // this.question.chapInfos.unshift({
      //   chap_info:this.question.description,
      //   seconds:this.question.descriptionFileSeconds,
      //   chap_info_url:this.question.descriptionFileUrl
      // });
      // this.question.prepareTimeBefore=0;//去掉多余的审题时间
      // 情景问答
      this.runArr=['listenGuide','readingTime','playQuestion','wait2Second','playSmallQuestion','readingTimeSmallQuestion','beforeRecord','startRecord','stopRecord','nextQuestion'];
      this.init()

    },
  }
</script>
<style lang="scss" scoped>
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
  }

</style>
