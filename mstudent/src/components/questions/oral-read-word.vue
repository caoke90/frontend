<!--短文朗读-->

<template>
  <div >
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>
    <ul class="oral-ask-information" v-show="showContent">
      <li class="simple-item" v-for="(item, index) in subContents" :class="{'item-active':questionIdx==index}">
        <div class="content"><span>Q{{index+1}}: {{item.content.value}}</span>
        </div>
      </li>
    </ul>
    <oral-question-footer ref="footer" :question="question" :qindex="qindex" @stopRecord="stopRecord"></oral-question-footer>
  </div>
</template>

<script>
  import Bus from '../../marvel/bus';
  import {startRecord,stopRecord} from '../../utils/record.js';
  import oralMixin from './mixin';
  export default {
    'name': 'oral-read-word',
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
  .simple-item {
    padding: 10px !important; border-left: 5px solid white; margin: 10px 0 !important;
    background: white;
    .content {
      display: inline-block;
      line-height: 27px;
      span {
        font-family: SFUIDisplay-Regular !important;
        p {
          display: inline;
        }
      }
    }
  }
  .item-active {
    border-left: 6px solid #65BB94;
    color: #444444;
    background: #F9FEFB;
  }
</style>
