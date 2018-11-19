<template>
  <div class="question-main-content main-content-entocn">
    <!--内容-->
    <component :subQuestion="subQuestion" :is="contentTpl" :qindex="qindex"></component>
    <!--选项-->
    <component :subQuestion="subQuestion" :is="optionsTpl" ref="option"></component>
  </div>
</template>

<script>
  import contentTpl from './tpls/contentBase';
  import optionsTpl from './tpls/choiceOptions';

  export default {
    name: "enToCn",
    props: ['question', 'subQuestion', 'qindex'],
    components: {contentTpl, optionsTpl},
    inject: ['showConfig'],
    data() {
      return {
        contentTpl: 'contentTpl',
        optionsTpl: 'optionsTpl'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss">
  @import "../../common/scss/common";

  .main-content-entocn {
    .content-text {
      @extend .mfont;
      font-size: 0.36rem;
      line-height: 0.54rem;
    }
  }
</style>
