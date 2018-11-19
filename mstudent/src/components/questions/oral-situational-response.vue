
<template>
  <div id="OralSituationalResponse" class="common-panel">
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>
    <div v-show="showContent" style="padding-bottom: 100px;">
      <template  v-for="(sentence, index) in subContents[0].options">
        <div v-if="sentence.roleType==2" class="sentence-item role-speak" :class="{'sentence-item-active': dialogIdx===index}" :ref="'everyspeaker_'+index" >
          <i class="horn" :class="{'horn-active': dialogIdx===index}"></i>
          <div class="text-wraper">
            <div class="name">{{sentence.name}}:</div>
            <div class="text mfont">{{sentence.text}}</div>
            <div v-if="dialogIdx===index" class="role-reading"></div>
          </div>
        </div>
        <div v-else class="sentence-item role-record" :class="{'sentence-item-active': dialogIdx===index}" :ref="'everyspeaker_'+index" >
          <i class="horn" :class="{'recordhorn-active': dialogIdx===index}"></i>
          <div class="text-wraper">
            <div class="name">{{sentence.name}}:</div>
            <div v-if="dialogIdx===index" class="role-reading"></div>
            <!--<div  class="text mfont">{{sentence.voiceTexts && sentence.voiceTexts[0] || sentence.text}}</div>-->
            <div v-else class="text mfont">{{sentence.text}}</div>
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

    'name': 'oral-situational-response',
    'mixins': [ oralMixin ],
    mounted () {
      Bus.curQuestion=this;
      console.log(this.question)
      // 情景对话
      this.runArr=['listenGuide','readingTime','playQuestion','wait2Second','playSituationalDialogue','readingTimeRecordDialogue','beforeRecord','startRecordDialogue','stopRecord','nextQuestion'];
      this.init();

    },
  }
</script>
<style lang="scss" scoped>
  .sentence-item{
    margin: 10px 0;
    background: #fff;
    position: relative;
    border-left: 4px solid #fff;
    .text-wraper{
      margin-left: 46px;
      margin-right: 40px;
      padding-bottom: 10px;
      padding-top: 10px;
      div{
        line-height: 27px;
      }
    }
    .horn {
      position: absolute;
      top: 15px;
      left: 12px;
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
  .role-record{
    .horn{
      height: 22px;
      width: 14px;
      background: url("../../assets/questions/microphone-grey.png") no-repeat;
      background-size: 100% 100%;
    }
    .recordhorn-active{
      height: 22px;
      width: 14px;
      background: url("../../assets/questions/microphone-high.png") no-repeat;
      background-size:100% 100%;
    }
    .text-wraper{
      .name{
        display: inline-block;
      }
      .text{
        display: inline-block;
      }
      div{
        display: inline-block;
      }
    }
  }
  .sentence-item-active{
    border-left:4px solid #6DC898;
    background: #F7FFFA;
    .text-wraper{
      div{
        color: #25A26C;
      }
    }
  }
</style>


