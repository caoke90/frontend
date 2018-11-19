
<template>
  <div id="OralSituationalDialogue" class="common-panel">
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>

      <div class='situationalDialogue' v-show="showContent">
        <div  class='questionContent'><p v-html='question.content' ></p></div>
        <div class='situationalHints'><p v-if='question.sceneDescription'>{{question.sceneDescription}}</p></div>
        <template v-for="(subq, qindex) in subContents">
          <div class="v-tpl-oral-sujective common-panel" v-show='questionIdx==qindex'>
            <div class="content-area">
              <div class="v-attr-content" :class="{'content-active':smallquestionPlaying}">
                <div v-if="subContents.length>1" class="smfont" :class="{'active':smallquestionPlaying}"><i class="horn" :class="{'horn-active':smallquestionPlaying}"></i>Q{{qindex+1}}:</div>
                <div v-if="(subq.content && subq.content.value) || subq.contentDesc" class="v-content-wrap mfont">
                  <div class="v-content-text"  :class="{'active':smallquestionPlaying}" v-html="(subq.content && subq.content.value) || subq.contentDesc"></div>
                </div>
              </div>
            </div>
          </div>

        </template>
      </div>
    <oral-question-footer ref="footer" :question="question" :qindex="qindex"  @stopRecord="stopRecord"></oral-question-footer>
  </div>
</template>

<script>
  import Bus from '../../marvel/bus';
  import {startRecord,stopRecord} from '../../utils/record.js';
  import oralMixin from './mixin';
  export default {

    'name': 'oral-situational-dialogue',
    'mixins': [ oralMixin ],
    mounted () {
      Bus.curQuestion=this;
      console.log(this.question)
      // 数据兼容
      // this.question.chapInfos.unshift({
      //   chap_info:this.question.description,
      //   seconds:this.question.descriptionFileSeconds,
      //   chap_info_url:this.question.descriptionFileUrl
      // });
      // 默认主流程
      this.runArr=['listenGuide','readingTime','playQuestion','wait2Second','playSmallQuestion','readingTimeSmallQuestion','beforeRecord','startRecord','stopRecord','nextQuestion'];
      this.init();

    },
  }
</script>
<style lang="scss" scoped>
  #OralSituationalDialogue{
    .situationalHints{
      padding: 15px;
      background: #fff;
      p{
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #444444;
        letter-spacing: 0;
        line-height: 23px;
      }
    }
    .questionContent{
      background: #fff;
      padding: 15px;
      color: #444444;
      p{
        font-size: 16px;
      }
    }
    .content-area{
      .v-attr-content{
        position: relative;
        border-left:4px solid #fff;
        background: #fff;
        line-height: 50px;
        margin-top:10px;
        .mfont{
          display: inline-block;
          max-width: 285px;
          line-height: 20px;
          margin-top: 15px;
        }
        .v-content-wrap.mfont  .v-content-text{
          word-wrap: break-word;
        }
        .smfont{
          display: inline-block;
          line-height: 50px;
          vertical-align: top;
          margin-left: 38px;
        }
        .horn {
          position: absolute;
          top: 16px;
          left: 10px;
          width: 22px;
          height: 16px;
          vertical-align: middle;
          background: url("../../assets/questions/horn-grey.png") no-repeat;
          background-size: contain;
        }
        .horn-active {
          background: url("../../assets/questions/horn-high.gif") no-repeat;
          background-size: contain;
        }
        .active {
          color: #65BB94;
        }
      }
      .content-active{
        border-left:4px solid #6DC898;
        background: #F7FFFA;
      }
    }
  }
</style>



