<template>
  <div class="question-main-content main-content-oral-word-followread">
    <!--音频-->
    <div class="content-wrapper">
      <div class="content-detail">
        <div class="audio-item clearfix">
          <div class="audio-file" v-if="subQuestion.listenFileUrl">
            <component :listen-url="subQuestion.listenFileUrl" :simpleAudio="simpleAudio"
                       :is="audioTpl"></component>
          </div>
          <template v-if="!subQuestion.listenFileUrl && subQuestion.options && subQuestion.options.length>0">
            <div class="listen-wrapper">
              <div v-for="(item, index) in subQuestion.options" :key="index" class="listen-item clearfix"
                   :class="{'one-item' :subQuestion.options.length==1}">
                <div class="listen-file-wrapper audio-file">
                  <component :listen-url="item.listenFileUrl" :simpleAudio="simpleAudio" :is="audioTpl"></component>
                </div>
                <div class="listen-item-des">{{item.text}}</div>
              </div>
            </div>
          </template>
          <div class="audio-text" v-html="subQuestion.showContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import audioTpl from '../../audio';

  export default {
    name: "oralWordFollowRead",
    props: ['question', 'subQuestion', 'qindex'],
    components: {audioTpl},
    data() {
      return {
        audioTpl: 'audioTpl',
        simpleAudio: true
      };
    },
    computed: {
      isShowContent: function () {
        let wordFollowRead = [2030047, 203017003];  // 单词跟读新老题型
        // TODO 需显示题目内容的题型
        let questionTypeList = [].concat(wordFollowRead);
        return questionTypeList.includes(this.question.questionType2Id);
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .audio-item {
    /*padding: 10px 0;*/
    overflow: hidden;
  }

  .audio-file {
    float: left;
    width: 24px;
    height: 24px;
  }

  .audio-text {
    margin-left: 34px;
  }

  .listen-item-des {
    margin-left: 34px;
  }

  .listen-wrapper {
    margin: 0;
  }

  .listen-item {
    padding-top: 20px;
    &:first-child, &.one-item {
      padding-top: 0;
    }
  }
</style>
