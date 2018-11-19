<!--回答问题-->

<template>
  <div id="oralAnswerQuestion" class="common-panel">
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>
    <ul class="oral-answer-question"
        v-if="showContent">
      <li class="media-item" v-for="(item, idx) in subContents"
          :class="{'item-active': (idx == questionIdx && subContents.length  > 1), 'item-play': (idx == questionIdx && smallquestionPlaying)}">
        <div class="icon">
          <i class="horn"
             :class="{ 'horn-active': (idx == questionIdx && smallquestionPlaying) }"></i>
        </div>
        <div class="content">
          <span v-html="'Q' + (idx+1) "></span>: <span v-html="item.content.value"></span>
        </div>
      </li>
    </ul>
    <oral-question-footer ref="footer" :question="question" :qindex="qindex"  @stopRecord="stopRecord"></oral-question-footer>
  </div>
</template>

<script>
  import Bus from '../../marvel/bus';
  import {startRecord,stopRecord} from '../../utils/record.js';
  import oralMixin from './mixin';
  export default {

    'name': 'oral-answer-question',
    'mixins': [ oralMixin ],
    mounted () {
      Bus.curQuestion=this;
      console.log(this.question)
      // 默认主流程
      this.runArr=['listenGuide','readingTime','playQuestion','wait2Second','playSmallQuestion','readingTimeSmallQuestion','beforeRecord','startRecord','stopRecord','nextQuestion'];
      this.init()

    },
  }
</script>
<style lang="scss" scoped>

  .media-item {
    display: flex; padding: 10px !important; margin: 10px 0 !important; border-left: 5px solid white;
    background: white;
    .icon {
      .horn {
        display: inline-block; width: 22px; height: 16px; margin: 6px 10px 5px 0px;
        background: url("../../assets/questions/horn-grey.png") no-repeat;background-size: cover;
      }
      .horn-active {
        background: url("../../assets/questions/horn-high.gif") no-repeat;background-size: cover;
      }
    }
    .content {
      display: inline-block;
      font-family: SFUIDisplay-Regular !important; line-height: 27px;
      p {
        display: inline;
      }
    }
  }
  .item-active {
    border-left: 6px solid #65BB94;
    color:#444444;
    background: #F9FEFB;
    .icon {
      .horn {
        background: url("../../assets/questions/horn-grey.png") no-repeat;background-size: cover;
      }
    }
  }

  .item-play {
    border-left: 6px solid #65BB94;
    color: #65BB94;
    background: #F9FEFB;
    .icon {
      .horn {
        background: url("../../assets/questions/horn-high.gif") no-repeat;background-size: cover;
      }
    }
  }

</style>

<style lang="scss" >
  .media-item {
    .content {
      p {
        display: inline;
      }
    }
  }
</style>
