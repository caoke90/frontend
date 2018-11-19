<template>
  <div class="content-wrapper">
    <div class="content-container content-container-judge">
      <!--内容-->
      <div class="content-detail clearfix">
        <div class="res-container-judge">
          ( <span class="judge-res-text" :class="[subQuestion.isCorrect?'res-correct':'res-wrong']"></span> )
        </div>
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
  /*  .content-text{
       display:inline;
       vertical-align : middle;
       p{
        display : inline;
       }
    }*/
  .content-detail {
    font-size: 0.28rem;
    color: #58595E;
    letter-spacing: 0;

    .res-container-judge {
      display: inline-block;
      float: left;
      width: 0.6rem;
      vertical-align: middle;

      .res-correct::before {
        content: 'T';
        color: #047CFF;
      }
      .res-wrong::before {
        content: 'F';
        color: #FF8E8C;
      }
    }
  }
</style>
