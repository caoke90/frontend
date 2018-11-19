<template>
  <div class="question-main-content main-content-judge">
    <!--题干-->
    <component :subQuestion="subQuestion" :is="contentTpl" :qindex="qindex"></component>
    <!--解析-->
    <template v-if="subQuestion.analysis">
      <component :subQuestion="subQuestion" :is="analysisTpl"></component>
    </template>
  </div>
</template>

<script>
  import contentTpl from './tpls/judgeContent';
  import analysisTpl from './tpls/analysisBase';

  export default {
    name: "judge",
    props: ['question', 'subQuestion', 'qindex'],
    components: {contentTpl, analysisTpl},
    inject: ['showConfig'],
    data() {
      return {
        contentTpl: 'contentTpl',
        analysisTpl: 'analysisTpl'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
