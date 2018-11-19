<!--回答问题-->

<template>
  <div id="OralSituationalQAnswer" class="common-panel">
    <oral-question-header ref="header" :question="question" :qindex="qindex"></oral-question-header>
    <oral-question-descbar ref="descbar" :question="question" :qindex="qindex"></oral-question-descbar>

    <template v-for="(subq, qindex) in subContents">
      <div class='situationalQAnswer' v-show="questionIdx==qindex">
        <div v-if='subq'>
          <div class="v-tpl-oral-sujective common-panel" v-show='showContent'>
            <div class="content-area">
              <div class="v-attr-content content-active" >
                <div v-if="subContents.length>1" class="smfont" :class="{'active':smallquestionPlaying}"><i class="horn" :class="{'horn-active':smallquestionPlaying}"></i>Q{{qindex+1}}:</div>
                <div v-if="subq.content.value || '音频播放中'" class="v-content-wrap mfont">
                  <div class="v-content-text" :class="{'active':smallquestionPlaying}" v-html="subq.content.value || '音频播放中'"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <oral-question-footer ref="footer" :question="question" :qindex="qindex"  @stopRecord="stopRecord"></oral-question-footer>
  </div>
</template>

<script>
  import Bus from '../../marvel/bus';
  import {startRecord,stopRecord} from '../../utils/record.js';
  import oralMixin from './mixin';
  export default {

    'name': 'oral-situational-qanswers',
    'mixins': [ oralMixin ],
    methods: {
      init:function(){
        this.progress=new Bus.Step(this.runArr,(step,time)=>{
          console.log(step)
          if(step=='readingTime'){
            this.showContent=true;
          }else if(step=='playQuestion'){
            this.questionPlaying=true;
          }else if(step=='playSmallQuestion'){
            this.smallquestionPlaying=true;
          }else if(step=='readingTimeSmallQuestion'){
            this.smallquestionPlaying=false;
            this.questionPlaying=false;
          }
          this[step](step,time);
          // 不需要隐藏答题
          if(step=='readingTime'||step=='playQuestion') {
            this.$refs.descbar.show()
          }else if(step=='readingTimeSmallQuestion'&&time==1){
            this.$refs.descbar.hide()
          }
        })
        this.progress.run();
        this.questionIdx=-1;
      }
    },
    mounted () {
      Bus.curQuestion=this;
      console.log(this.question)
      // 数据兼容
      // this.question.chapInfos.unshift({
      //   chap_info:this.question.description,
      //   seconds:this.question.descriptionFileSeconds,
      //   chap_info_url:this.question.descriptionFileUrl
      // });
      // 情景问答
      this.runArr=['listenGuide','playQuestion','wait2Second','readingTime','playSmallQuestion','readingTimeSmallQuestion','beforeRecord','startRecord','stopRecord','nextQuestion'];
      this.init()

    },
  }
</script>
<style lang="scss" scoped>
  #OralSituationalQAnswer{
    .situationalHints{
      padding: 15px;
      background: #fff;
      margin-top: 10px;
      p{
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #444444;
        letter-spacing: 0;
        line-height: 23px;
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
