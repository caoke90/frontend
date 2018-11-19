

<template>
  <div id="oralAskInformation" class="common-panel">
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>
    <ul class="oral-ask-information">
      <li class="simple-item item-active" v-if="questionIdx>-1">
        <div class="content"><span>Q{{questionIdx+1}}: {{subContents[questionIdx].content.value}}</span>
        </div>
      </li>
    </ul>
    <oral-question-footer ref="footer" :question="question" :qindex="qindex"  @stopRecord="stopRecord"></oral-question-footer>
  </div>
</template>

<script>
  import Bus from '../../marvel/bus';
  import {startRecord,stopRecord} from '../../utils/record.js';
  import oralMixin from './mixin';
    export default {
        'name': 'oral-ask-information',
      'mixins': [ oralMixin ],
      mounted () {
        Bus.curQuestion=this;
        console.log(this.question)
        // 数据兼容

        this.question.prepareTimeBefore=0;//去掉多余的审题时间

        // 默认主流程
        this.runArr=['listenGuide','readingTime','playQuestion','wait2Second','playSmallQuestion','readingTimeSmallQuestion','beforeRecord','startRecord','stopRecord','nextQuestion']
        this.init()

      },
    }
</script>
<style lang="scss" scoped>
  .simple-item {
    padding: 10px !important; border-left: 5px solid white; margin: 10px 0 !important;
    background: white;
    .content {
      display: inline-block;
      line-height: 27px;
      span {
        font-family: SFUIDisplay-Regular !important;
        p {
          display: inline;
        }
      }
    }
  }
  .item-active {
    border-left: 6px solid #65BB94;
    color: #444444;
    background: #F9FEFB;
  }
</style>
