<!--听选信息-->

<template>
  <div id="oral_l_s" class="common-panel">
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>
    <div v-show="showContent">
      <div class="content-area" v-for="(item, idx) in subContents" :class="{ 'active': (idx == questionIdx && subContents.length  > 1), 'playing': (idx == questionIdx && smallquestionPlaying) }">
        <!--小题音频播放-->
        <div class="v-attr-content">
          <div class="v-content-wrap mfont">
            <div class="question-idx">Q{{idx+1}}: </div>
            <div class="v-content-text" v-html="item.content.value"></div>
          </div>
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

    'name': 'oral-listen-select',
    'mixins': [ oralMixin ],
    mounted () {
      Bus.curQuestion=this;
      console.log(this.question)
      // 默认主流程
      this.runArr=['listenGuide','readingTime','playQuestion','wait2Second','playSmallQuestion','readingTimeSmallQuestion','beforeRecord','startRecord','stopRecord','nextQuestion'];
      this.init()
    },
  }
</script>
<style lang="scss" scoped>
  @keyframes text_show {
    0% { opacity: 0; }
    50% { opacity: 0.8; }
    100% { opacity: 1; }
  }

  #oral_l_s {
    padding: 0 !important;
    .content-area {
      position: relative;
      line-height: 1.8;
      padding: 0 15px;
      background: #fff;
      margin-bottom: 10px;
      border-left: 6px solid #fff;
      box-sizing: border-box;
      &:before {
        content: "";
        position: absolute;
        left: 9px;
        top: 20px;
        content: "";
        width: 20px;
        height: 16px;
        vertical-align: middle;
        background: url("../../assets/questions/horn-grey.png") no-repeat;
        background-size: contain;
      }
      &.playing:before {
        content: "";
        position: absolute;
        left: 9px;
        top: 20px;
        content: "";
        width: 20px;
        height: 16px;
        vertical-align: middle;
        background: url("../../assets/questions/horn-high.gif") no-repeat;
        background-size: contain;
      }
      &.active {
        background: #F9FFFB 100%;
        border-left: 6px solid #6DC898;
      }
      .v-content-text {
        font-family: SFUIDisplay-Regular;
        color: #444444;
        line-height: 27px;
        padding: 14px 0;
        font-size: 15px;
      }
      .v-content-wrap {
        animation: text_show .2s ease-in;
        padding-left: 24px;
        .question-idx {
          position: absolute;
          padding: 14px 0;
        }
        .v-content-text {
          text-indent: 32px;
        }
      }
    }
  }

</style>


