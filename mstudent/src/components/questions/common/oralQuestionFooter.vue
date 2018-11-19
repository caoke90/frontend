<!--1、答题说明 aa:aa/bb:bb	播放答题指导语音频，显示音频播放倒计时-->
<!--2、请听题（第x遍） aa:aa/bb:bb-->

<!--播放题干材料音频，显示音频播放倒计时-->

<!--*如果只有1遍，则括号中的内容不显示-->

<!--3、请审题 aa:aa/bb:bb	显示准备时间倒计时，审题之后的步骤不是录音，而是阅读题干等材料-->
<!--4、准备答题 aa:aa/bb:bb-->
<!--显示准备时间倒计时，审题之后的步骤是开始录音，特殊情况：-->

<!--1、情景问答题型下，由于没有题干文本，因此准备时间环节中状态统一为准备答题-->

<!--2、情景对话题型下，不管机器录音的先后顺序，准备时间环节中状态统一为准备答题-->

<!--3、询问信息题型下，格式为准备答题（第x题） aa:aa/bb:bb-->

<!--5、开始录音…-->
<!--播放开始录音提示音，同时页面中出现开始录音和3s倒计时toast-->

<!--6、点击结束录音 aa:aa/bb:bb-->
<!--显示录音倒计时-->

<!--当录音时间>=30s，录音时间最后5s，当前已录时间即aa:aa颜色标红-->
<!--点击状态区，可提前结束录音-->
<!--7、录音提交中…-->
<!--用户录音提交-->

<!--如果提交或评分失败，则弹框提示“录音失败，请重录！”，点击“重录”，将重复开始录音步骤-->

<!--8、提交成功，正在跳转-->
<!--如果提交成功，则答题状态变更为“提交成功，正在跳转”，如果本题中还有其他题，则进入到下一小题/下一大题，如果没有，则跳转到答题卡结果页-->


<template>

  <div class="v-tpl-ctrlbar bfont">
    <!-- div模拟0.5px -->
    <div class="line05"></div>

    <div class="v-panel-reviewctrl" v-if="homeworkMode && switchCtrlBar">
      <!-- 口语 start; @action: 除了上一页和下一页还有播放声音功能; -->
      <template>
                <span class="review-btn left">
                    我的录音
                </span>
        <div class="result-area">
          <!-- 播放功能按钮 start; -->
          <i class="redo-icon play" @click="redo"></i>
          <!-- 播放功能按钮 end; -->
          <span class="label vam">重做</span>
        </div>
        <span class="review-btn right"
              @click="next">
                    下一题
                </span>
      </template>
      <!-- 口语 end; -->
    </div>

    <!-- 录制音频和播放音频时的展示模板，包括时间倒计时功能 start; -->
    <div class="v-panel-oralctrl" v-else @click="stopRecord">
      <div class="oral-timer"
           :class="{'recording': stopRecordBtn}">
        <span class='footerWord'  :class="{'sfont': stopRecordBtn,'playing': (titleState =='5'|| titleState =='6'|| titleState =='7')}">{{ title }}</span>
        <div class="sound-wave"
             v-show="stopRecordBtn">
          <yq-voice ref="voiceWave"
                    :width="15" :height="20">
          </yq-voice>
        </div>
        <!-- 展示时间组件 start; -->
        <yq-timer v-show="titleState!=5&&titleState!=7" ref="timer" :titleState="titleState" @timeEnd="timeEnd"></yq-timer>
        <!-- 展示时间组件 end; -->

        <!-- 展示跳过按钮 -->
        <div v-if="homeworkMode && (titleState == 1 || titleState == 3)" class="oral-jump" @click="oralJump">跳过</div>
      </div>
    </div>
    <!-- 录制音频和播放音频时的展示模板，包括时间倒计时功能 end; -->

  </div>
</template>


<script>
  // import AudioComponent from './audioComponent.vue';
  import Voice from './voice.vue';
  import Timer from './timer.vue';
  import Bus from '../../../marvel/bus.js';

  export default {
    'name': 'oral-question-footer',
    'components': {
      // 'yq-audio-component': AudioComponent,
      'yq-voice': Voice,
      'yq-timer': Timer
    },
    props: ['question', 'qindex'],
    data () {
      return {
        titleState:1,
        titlemore:'',
        title:'答题说明',
        status:{
          "1":"答题说明",
          "2":"请审题",
          "3":"请听题",
          "4":"准备答题",
          "5":"开始录音...",
          "6":"录音提交中...",
          "7":"录音成功，正在跳转...",
          "8":"点击结束",
          "9":"录音失败，请重试",
        },
        'switchCtrlBar': false,
        'timer': null,
        'voiceWave': null,
      }
    },
    methods: {
      setState(titleState){
        this.titleState=titleState;
      },
      setTime:function(){
        this.$refs.timer.start(30)
      },
      next () {
        this.$emit('next');
      },
      prev () {
        this.$emit('prev');
      },
      //跳过
      oralJump(){

      },
      stopRecord () {
        // 点击停止录音
        if (!this.stopRecordBtn) {
          return;
        }
        this.$emit('stopRecord')
      },
      init (titleState,seconds) {
        this.titleState=titleState;
        //按钮文字
        this.title=this.status[this.titleState]
        this.$refs.timer.start(seconds)
        console.log(seconds)
      },
      timeEnd:function () {
        this.$emit('timeEnd',this.titleState)
      }
    },
    computed: {
      // 点击结束
      stopRecordBtn(){
        return this.titleState == 8
      },
      //是否作业模式
      homeworkMode () {
        return Bus.config.homeworkMode;
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss" scoped>

  @import "./common.scss";

  .v-tpl-ctrlbar {
    position: absolute; left: 0; bottom: 0; z-index: 5;
    width: 100%; height: 53px;
    text-align: center; font-size: 16px; color: #12bc44;
    background-color: #fff;
    .v-panel-oralctrl {
      height: 100%;
      color: #00bf3c;
      .sound-wave {
        height: 20px;
        width: 15px;
        margin: 0 2px 0 0px;
        display: inline-block;
        vertical-align: middle;
        background: $green;
      }
      .oral-timer{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 53px;
        line-height: 53px;
        &.recording{
          height: 100%;
          background: $green;
          color: #fff;
        }
        >span{
          // display: inline-block;
          // vertical-align: middle;
          margin: 0 8px;
          font-size: 14px;
          color: #AAAAAA;
          letter-spacing: 0;
          text-align: center;
        }
        .footerWord{
          // vertical-align: middle;
          // margin-right:6px;
          font-family: pingfang SC !important;
        }
        span.playing{
          color: #6DC898;
        }
        span.sfont{
          color: #fff;
        }
        .oral-jump {
          position: absolute;
          right: 0;
          width: 40px;
          height: 20px;
          display: inline-block;
          line-height: 20px;
          margin: 16.5px;
          font-size: 14px;
          border: 1px solid #ddd;
          border-radius: 15px;
          color: #ddd;
        }
      }
    }
    .v-panel-reviewctrl{
      color: #383838;
      .result-area{
        position: absolute; top: 0; left: 50%;
        width: 50px; height: 53px; margin-left: -25px;
        font-size: 12px;
        .redo-icon{
          position: absolute; top: -19px; left: 0;
          width: 49px; height: 49px;
          background-size: 49px 49px; background-repeat:no-repeat;
          &.play{
            background-image: url(../../../assets/questions/i-record-play.png);
          }
        }
        .vam{
          position: absolute; bottom: 5px; left: 0;
          width: 100%;
          text-align: center;
        }
      }
      .review-btn{
        display: inline-block;
        line-height:53px;
        width: 35%;
        &.left{
          text-align: left;
        }
        &.right{
          text-align: right;
        }
      }
    }
    .line05{
      @include line($width, 0.5, $grey);
    }
  }


</style>
