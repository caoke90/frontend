<template>
  <div class="question-main-content main-content-sort">
    <!--题干-->
    <component :subQuestion="subQuestion" :is="contentTpl" :qindex="qindex"></component>
    <!--选项-->
    <template v-if="subQuestion.optionPreviewList">
      <div class="option-wrapper">
        <div v-if="subQuestion.optionTypeMark==0" class="option-preview option-preview-word clearfix">
          <ul class="option-list">
            <li class="option-item option-type-text" v-for="(item, index) in subQuestion.optionPreviewList"
                :key="index">
              <div class="option-content">
                <span v-html="item"></span>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="subQuestion.optionTypeMark==1" class="option-preview option-preview-sentence clearfix">
          <ul class="option-list">
            <li class="option-item option-type-text" v-for="(item, index) in subQuestion.optionPreviewList"
                :key="index">
              <div class="option-content">
                <span v-html="item"></span>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="subQuestion.optionTypeMark==2" class="option-preview option-preview-img clearfix">
          <ul class="option-list">
            <li class="option-item option-type-img" v-for="(item, index) in subQuestion.optionPreviewList" :key="index">
              <div class="option-index"><span>{{index+1}}.</span></div>
              <div class="option-content">
                <span>
                  <mv-img :html="item"></mv-img>
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="subQuestion.optionTypeMark==4" class="option-preview option-preview-other">
          <ul class="option-list">
            <li class="option-item option-type-text" v-for="(item, index) in subQuestion.optionPreviewList"
                :key="index">
              <div class="option-content">
                <span v-html="item"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>

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
  import answerTpl from './tpls/answerBase';
  import analysisTpl from './tpls/analysisBase';

  export default {
    name: "sortBase",
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
