<template>
  <div class="question-main-content main-content-oral-subjective">
    <!--听力材料-->
    <template v-if="subQuestion.listenFileUrl">
      <div class="listen-wrapper">
        <div class="listen-file-wrapper">
          <component :listen-seconds="subQuestion.listenFileSeconds" :listen-url="subQuestion.listenFileUrl" :is="audioTpl"></component>
        </div>
        <div v-if="subQuestion.contentDesc" class="content-desc-wrapper">
          <div class="content-desc-title">听力原文</div>
          <div class="content-desc-text" v-html="subQuestion.contentDesc"></div>
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
  import audioTpl from '../../audio';
  import contentTpl from '../tpls/oralSubjectiveContent';
  import answerTpl from '../tpls/answerBase';
  import analysisTpl from '../tpls/analysisBase';

  export default {
    name: "oralSubjective",
    props: ['question', 'subQuestion', 'qindex'],
    components: {audioTpl, contentTpl, answerTpl, analysisTpl},
    inject: ['showConfig'],
    data() {
      return {
        audioTpl: 'audioTpl',
        contentTpl: 'contentTpl',
        answerTpl: 'answerTpl',
        analysisTpl: 'analysisTpl'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
