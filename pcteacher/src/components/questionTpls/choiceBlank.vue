<template>
  <div class="question-main-content main-content-choiceblank">
    <!--选项预览-->
    <template v-if="subQuestion.optionPreviewList">
      <div class="option-wrapper">
        <div v-if="subQuestion.optionTypeMark==0" class="option-preview option-preview-word clearfix">
          <ul class="option-list">
            <li class="option-item option-type-text" v-for="(item, index) in subQuestion.optionPreviewList"
                :key="index">
              <span v-html="item" class="option-content"></span>
            </li>
          </ul>
        </div>
        <div v-if="subQuestion.optionTypeMark==1" class="option-preview option-preview-sentence clearfix">
          <ul class="option-list">
            <li class="option-item option-type-text" v-for="(item, index) in subQuestion.optionPreviewList"
                :key="index">
              <span v-html="item" class="option-content"></span>
            </li>
          </ul>
        </div>
        <div v-if="subQuestion.optionTypeMark==2" class="option-preview option-preview-img clearfix">
          <ul class="option-list">
            <li class="option-item option-type-img" v-for="(item, index) in subQuestion.optionPreviewList" :key="index">
              <span class="option-index">{{String.fromCharCode(65+index)}}</span>
              <div v-html="item" class="option-content"></div>
            </li>
          </ul>
        </div>
        <div v-if="subQuestion.optionTypeMark==4" class="option-preview option-preview-other">
          <ul class="option-list">
            <li class="option-item option-type-text" v-for="(item, index) in subQuestion.optionPreviewList"
                :key="index">
              <span v-html="item" class="option-content"></span>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <!--题干-->
    <component :subQuestion="subQuestion" :is="contentTpl" :qindex="qindex"></component>
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
  import analysisTpl from './tpls/analysisBase';
  import answerTpl from './tpls/answerBase';

  export default {
    name: "choiceBlank",
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
  .option-preview {
    &.option-preview-word, &.option-preview-other,&.option-preview-sentence {
      li {
        float: left;
        span {
          display: inline-block;
        }
      }
    }
    .option-list {
      li {
        margin-right: 6px;
        margin-bottom: 5px;
      }
    }
    .option-content {
      padding: 2px 4px;
      border: 1px solid #CCCCCC;
      border-radius: 2px;
      opacity: 1;
      font-size: 14px;
      color: #58595E;
      letter-spacing: 0;
      line-height: 18px;
    }
  }
</style>
