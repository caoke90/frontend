<template>
  <div class="content-wrapper">
    <div class="content-container content-container-oral-subjective">
      <!--内容-->
      <div class="content-detail ">
        <div class="subq-index" v-if="showQindex">{{showQindex}}.</div>
        <div v-if="showContent" class="content-text content-text-oral-subjective" v-html="showContent"></div>
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
      return {
        audioTpl: 'audioTpl'
      };
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
        let content = this.subQuestion.showContent;
        if (!content || content == "<br>") {
          content = this.subQuestion.contentDesc;
        }
        return content;
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
/*  .content-text{
     display:inline;
     vertical-align : middle;
     p{
      display:inline;
     }
  }*/
</style>
