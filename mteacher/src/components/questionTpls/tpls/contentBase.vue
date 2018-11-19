<template>
  <div class="content-wrapper">
    <div class="content-container content-container-base">
      <div class="listen-wrapper" v-if="subQuestion.listenUrl && question.complex == 1">
        <!--听力材料-->
        <div class="listen-file-wrapper">
          <component :listen-seconds="subQuestion.listenSeconds" :listen-url="subQuestion.listenUrl" :is="audioTpl"></component>
        </div>
      </div>
      <!--内容-->
      <div class="content-detail">
        <div class="subq-index" v-if="showQindex">{{showQindex}}.</div>
        <div v-if="showContent" class="content-text content-text-base">
          <mv-img :html="showContent"></mv-img>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import audioTpl from '../../audio';
  export default {
    props: ['subQuestion', 'qindex'],
    inject: ['showConfig', 'question'],
    components: {audioTpl},
    data() {
      return {audioTpl: 'audioTpl'};
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
/*  .content-text {
    display: inline;
    vertical-align: middle;
  }*/
</style>
