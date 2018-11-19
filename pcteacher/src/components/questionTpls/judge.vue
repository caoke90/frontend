<template>
  <div class="question-main-content main-content-judge">
    <!--题干-->
    <component :subQuestion="subQuestion" :is="contentTpl" :qindex="qindex"></component>
    <!--判断题选项-->
    <div class="option-wrapper">
      <div v-if="subQuestion.options" class="options-container options-container-judge">
        <ul class="option-list clearfix">
          <li class="option-item"
              v-for="(item, index) in subQuestion.options"
              :key="index">
            <div class="option-index"><span>{{item.showIndex}}.</span></div>
            <div class="option-content" v-html="item.option">
            </div>
          </li>
        </ul>
      </div>
    </div>

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
  import contentTpl from './tpls/judgeContent';
  import analysisTpl from './tpls/analysisBase';
  import answerTpl from './tpls/answerBase';

  export default {
    name: "judge",
    props: ['question', 'subQuestion', 'qindex'],
    components: {contentTpl, answerTpl, analysisTpl},
    inject: ['showConfig'],
    data() {
      return {
        contentTpl: 'contentTpl',
        answerTpl: 'answerTpl',
        analysisTpl: 'analysisTpl'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
