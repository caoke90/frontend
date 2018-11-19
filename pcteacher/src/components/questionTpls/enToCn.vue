<template>
  <div class="question-main-content main-content-entocn">
    <!--内容-->
    <component :subQuestion="subQuestion" :is="contentTpl" :qindex="qindex"></component>
    <!--选项-->
    <component :subQuestion="subQuestion" :is="optionsTpl" ref="option"></component>

    <template v-if="subQuestion.answers || subQuestion.analysis">
      <transition name="fade">
        <div class="answer-analysis-wrapper" v-show="question.showAnswerAnalysis">
          <!--答案-->
          <template v-if="subQuestion.answers">
            <component :subQuestion="subQuestion" :is="answerTpl"></component>
          </template>
          <!--解析-->
          <template v-if="subQuestion.analysis">
            <component :subQuestion="subQuestion" :is="analysisTpl"></component>
          </template>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
  import contentTpl from './tpls/contentBase';
  import optionsTpl from './tpls/choiceOptions';
  import analysisTpl from './tpls/analysisBase';
  import answerTpl from './tpls/answerBase';

  export default {
    name: "enToCn",
    props: ['question', 'subQuestion', 'qindex'],
    components: {contentTpl, optionsTpl, answerTpl, analysisTpl},
    inject: ['showConfig'],
    data() {
      return {
        contentTpl: 'contentTpl',
        optionsTpl: 'optionsTpl',
        answerTpl: 'answerTpl',
        analysisTpl: 'analysisTpl'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss">
  @import "../../common/scss/common";

  .main-content-entocn {
    .content-text {
      font-size: 22px;
      line-height: 28px;
      color: #555555;
    }
  }
</style>
