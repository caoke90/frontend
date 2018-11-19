<template>
  <div class="question-main-content main-content-choice">
    <!--题干-->
    <component :subQuestion="subQuestion" :is="contentTpl" :qindex="qindex"></component>
    <!--选项-->
    <component :subQuestion="subQuestion" :is="optionsTpl" ref="option"></component>
    <!--解析-->
    <template v-if="subQuestion.analysis">
      <component :subQuestion="subQuestion" :is="analysisTpl"></component>
    </template>
  </div>
</template>

<script>
  import contentTpl from './tpls/contentBase';
  import optionsTpl from './tpls/choiceOptions';
  import analysisTpl from './tpls/analysisBase';

  export default {
    name: "choice",
    props: ['question', 'subQuestion', 'qindex'],
    components: {contentTpl, optionsTpl, analysisTpl},
    inject: ['showConfig'],
    data() {
      return {
        contentTpl: 'contentTpl',
        optionsTpl: 'optionsTpl',
        analysisTpl: 'analysisTpl'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
