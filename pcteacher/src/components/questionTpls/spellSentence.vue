<template>
  <div class="question-main-content main-content-spellsentence">
    <!--题干-->
    <div class="content-wrapper">
      <div v-if="subQuestion.answers" class="content-container content-container-spellsentence">
        <div class="content-detail">
          <ul class="content-text clearfix">
            <li v-for="(ans,index) in subQuestion.answers" :key="index">
              <span class="content-text">{{subQuestion.optionPreviewList[ans]}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--文本-->
    <div v-if="subQuestion.analysis" class="cn-text">{{subQuestion.analysis}}</div>
    <!--选项-->
    <div class="option-wrapper">
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
    name: "spellSentence",
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
  .content-text {
    li {
      float: left;
      margin-right: 6px;
      span {
        font-size: 22px;
        color: #555555;
        letter-spacing: 0;
        line-height: 30px;
        text-decoration: underline;
      }
    }
  }

  .cn-text {
    margin: 20px 0 10px 0;
    font-size: 14px;
    color: #7F7E7E;
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
      padding: 4px;
      border: 1px solid #CCCCCC;
      border-radius: 3px;
      opacity: 0.9;
      font-size: 14px;
      color: #555555;
      letter-spacing: 0;
      text-align: center;
      line-height: 24px;
    }
  }
</style>
