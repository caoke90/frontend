<template>
  <div class="question-main-content main-content-blank">
    <!--题干-->
    <component :subQuestion="subQuestion" :is="contentTpl" :qindex="qindex"></component>
    <!--答案-->
    <template v-if="subQuestion.answers">
      <component :subQuestion="subQuestion" :is="answerTpl" :qindex="qindex"></component>
    </template>

    <!--解析-->
    <template v-if="subQuestion.analysis">
      <component :subQuestion="subQuestion" :is="analysisTpl"></component>
    </template>
  </div>
</template>

<script>
  import contentTpl from './tpls/contentBase';
  import answerTpl from './tpls/answerList';
  import analysisTpl from './tpls/analysisBase';

  export default {
    name: "blank",
    props: ['question', 'subQuestion', 'qindex'],
    components: {contentTpl, analysisTpl, answerTpl},
    inject: ['showConfig'],
    data() {
      return {
        contentTpl: 'contentTpl',
        analysisTpl: 'analysisTpl',
        answerTpl: 'answerTpl'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
