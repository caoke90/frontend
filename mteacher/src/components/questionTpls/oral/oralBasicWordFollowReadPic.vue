<template>
  <div class="question-main-content main-content-oralbasic-word-followread">
    <!--音频-->
    <template v-if="subQuestion.options">
      <div class="listen-wrapper">
        <div v-for="(item, index) in subQuestion.options" :key="index" class="linten-item clearfix">
          <div class="listen-file-wrapper audio-file">
            <component :listen-url="item.listenUrl" :simpleAudio="simpleAudio" :is="audioTpl"></component>
          </div>
        </div>
      </div>
    </template>

    <!--题干-->
    <template v-if="isShowContent && subQuestion.showContent">
      <component :subQuestion="subQuestion" :is="contentTpl" :qindex="qindex"></component>
    </template>
  </div>
</template>

<script>
  import audioTpl from '../../audio';
  import contentTpl from '../tpls/contentBase';

  export default {
    name: "oralBasicWordFollowReadPic",
    props: ['question', 'subQuestion', 'qindex'],
    components: {audioTpl, contentTpl},
    data() {
      return {
        audioTpl: 'audioTpl',
        contentTpl: 'contentTpl',
        simpleAudio: true
      };
    },
    computed: {
      isShowContent: function () {
        let _typeOld = [2030047, 2030048]; // 单词跟读、例句跟读
        let _typeNew = [203017003, 203017005]; // 新题型  单词跟读、例句跟读
        // TODO 显示题干内容的题型
        let questionTypeList = [].concat(_typeOld, _typeNew);
        return questionTypeList.includes(this.question.questionType2Id);
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .listen-wrapper, .content-wrapper {
    margin-top: 0;
  }

  .listen-wrapper {
    float: left;
  }

  .content-wrapper {
    margin-left: 0.64rem;
  }

  .audio-item {
    padding: 0.10rem 0;
    overflow: hidden;
  }

  .audio-file {
    float: left;
    width: 0.44rem;
  }

  .audio-text {
    margin-left: 0.64rem;
    font-size: 0.30rem;
    color: #171717;
    letter-spacing: 0;
    line-height: 0.44rem;
  }
</style>
