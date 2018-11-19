<template>
  <div class="question-main-content main-content-oral-word-read">
    <div class="content-wrapper">
      <div class="content-detail">
        <div class="audio-item clearfix">
          <div class="audio-file" v-if="subQuestion.listenFileUrl">
            <component :listen-url="subQuestion.listenFileUrl" :simpleAudio="simpleAudio"
                       :is="audioTpl"></component>
          </div>
          <div class="audio-text" v-html="subQuestion.showContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import audioTpl from '../../audio';

  export default {
    name: "oralWordRead",
    props: ['question', 'subQuestion', 'qindex'],
    components: {audioTpl},
    data() {
      return {
        audioTpl: 'audioTpl'
      };
    },
    computed: {
      simpleAudio: function () {
        let shortRead = [2030062, 203016000]; // 短文朗读新老题型
        // TODO 显示进度条的题型
        let questionTypeList = [].concat(shortRead);
        return !questionTypeList.includes(this.question.questionType2Id);
      }

    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .audio-item {
    padding: 0.10rem 0;
    overflow: hidden;
  }

  .audio-file + .audio-text {
    margin-top: 0.40rem;
  }
</style>
