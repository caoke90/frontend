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
          <template v-if="!subQuestion.listenFileUrl && subQuestion.oralDict && subQuestion.oralDict.options && subQuestion.oralDict.options.length>0">
            <div class="listen-wrapper" :class="{'one-item' :subQuestion.options.length==1}">
              <div v-for="(item, index) in subQuestion.oralDict.options" :key="index" class="linten-item clearfix" >
                <div class="listen-file-wrapper audio-file">
                  <component :listen-url="item.listenFile.url" :simpleAudio="simpleAudio" :is="audioTpl"></component>
                </div>
                <div class="linten-item-des">{{item.text}}</div>
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
    padding: 0.10rem 0;
    overflow: hidden;
  }

  .audio-file {
    float: left;
    width: 0.44rem;
  }

  .audio-text {
    margin-left: 0.64rem;
  }

  .linten-item{
    padding:0.18rem 0 0.18rem 0;
  }

  .linten-item:first-child{
    padding:0 0 0.1rem 0;
  }

  .linten-item-des{
    margin-left: 0.6rem;
  }

  .listen-wrapper.one-item {
    margin: 0;
  }
</style>
