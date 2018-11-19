<template>
  <div class="content-wrapper">
    <div class="content-container content-container-judge">
      <!--内容-->
      <div class="content-detail clearfix">
        <div class="subq-index" v-if="showQindex">{{showQindex}}.</div>
        <div v-if="showContent" class="content-text content-text-judge" v-html="showContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import audioComponent from '../../audio';

  export default {
    props: ['subQuestion', 'qindex'],
    inject: ['showConfig', 'question'],
    components: {audioComponent},
    data() {
      return {audioTpl: 'audioComponent'};
    },
    computed: {
      showQindex() {
        let index = null;
        if (this.showConfig.showIndex || this.question.complex) {
          index = parseInt(this.qindex + 1);
        }
        return index;
      },
      showContent() {
        let content = this.subQuestion.showContent || '';
        return content;
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
</style>
