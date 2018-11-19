<template>
  <div class="question-main-content main-content-spellword">
    <!--题干-->
    <div class="content-wrapper sub-content-spellword">
      <div class="content-container content-container-spellword">
        <div class="content-detail">
          <div v-if="subQuestion.showContent" class="content-text">
            <mv-img :html="subQuestion.showContent"></mv-img>
          </div>
        </div>
      </div>
    </div>
    <!--选项-->
    <div class="sub-option-wrapper sub-option-spellword">
      <div v-if="subQuestion.optionPreviewList" class="option-preview clearfix">
        <ul class="option-list clearfix">
          <li class="option-item" v-for="(item, index) in subQuestion.optionPreviewList" :key="index">
            <span v-html="item" class="option-text"></span>
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
  import analysisTpl from './tpls/analysisBase';
  import answerTpl from './tpls/answerBase';

  export default {
    name: "spellWord",
    props: ['question', 'subQuestion', 'qindex'],
    components: {answerTpl, analysisTpl},
    data() {
      return {
        analysisTpl: 'analysisTpl',
        answerTpl: 'answerTpl'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .word-text {
    font-size: 14px;
    color: #171717;
    letter-spacing: 0;
    line-height: 20px;
  }

  .sub-option-wrapper {
    margin-top: 8px;
  }

  .option-preview {
    margin-bottom: 20px;
    .option-list {
      li {
        float: left;
        margin-right: 6px;
      }
    }
    .option-text {
      padding: 3px 6px;
      border: 1px solid #CCCCCC;
      border-radius: 4px;
      opacity: .9;
      font-size: 16px;
      color: #555555;
      letter-spacing: 0;
      text-align: center;
      line-height: 24px;
    }
  }
</style>
