<!--
    @action: 口语题和非口语题答题说明，支持音频播放功能，从产品的 wiki 来看几乎 12 种口语题型都需要；

-->

<template>
  <div class="question-desc">
    <!-- 标题栏 start; -->
    <div class="desc-title">
      <i class="horn"
         :class="{'horn-active': (!isAudioEnd)}">
      </i>
      <span :class="{'active': (!isAudioEnd)}">答题说明</span>
      <i class="btn"
         :class="{'btn-up': (!descStatus)}"
         @click="changeDesc">
      </i>
    </div>
    <!-- 标题栏 end; -->

    <!-- 可张开关闭的内容描述部分 start;-->
    <div class="content"
         v-if="descStatus">
      {{ chapInfo }}
    </div>
    <!-- 可张开关闭的内容描述部分 end; -->
  </div>
</template>

<script>
  import h5Audio from './audio.js'
  export default {
    'name': 'question-desc-bar',

    props: ['question', 'qindex'],
    data () {
      return {
        chapInfo:'',
        descAudio: null,                                                                                          // 描述音频的引用;
        isAudioEnd: false,                                                                                        // 音频是否播放结束状态;
        isAudioPlaying: false,                                                                                   // 音频的播放状态;
        isCurrentPlaying: false,                                                                                   // 音频的播放状态;
        descStatus: true,                                                                           // 答题说明文本部分展示状态;
      }
    },
    'methods': {
      init () {

      },

      show (chapInfo) {                                  // 展开内容描述;
        if(chapInfo){
          this.chapInfo=chapInfo;
        }
        this.descStatus = true;
      },
      hide () {                                 // 隐藏内容描述;
        this.descStatus = false;
      },
      changeDesc () {                                 // 改变内容描述状态;
        if (this.descStatus) {
          this.hide();
        } else {
          this.show();
        }
      },
      changeAudioEnd (isAudioEnd) {
        this.isAudioEnd = isAudioEnd;
      },

    }
  }
</script>
<style lang="scss" scoped>
  .question-desc {
    background: #fff;
    margin-bottom: 10px;
    .desc-title {
      position: relative;
      height: 56px;
      padding: 16px 15px;
      box-sizing: border-box;
      font-size: 15px;
      .audio-btn {
        cursor: pointer;
      }
      .horn {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 22px; height: 16px;
        background: url("../../../assets/questions/horn-grey.png") no-repeat;
        background-size: contain;
      }
      .horn-active {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 22px; height: 16px;
        background: url("../../../assets/questions/horn-high.gif") no-repeat;
        background-size: contain;
      }
      .active {
        color: #65BB94;
      }
      span {
        display: inline-block;
        vertical-align: middle;
        color: #444;
        margin-left: 8px;
      }
    }
    .content {
      color: #AAA;
      font-size: 14px;
      line-height: 21px;
      padding: 0 15px 18px;
      font-family: PingFangSC-Regular;
    }
    .btn {
      float: right;
      height: 32px;
      width: 32px;
      margin-top: -3px;
      cursor: pointer;
      // margin: 6.5px 0;
      display: inline-block;
      background: url("../../../assets/questions/up.png") no-repeat center center;
      background-size: 12.9px 7.4px;
      transform: rotate(0deg);
      transition: transform .4s ease-out;
    }
    .btn-up {
      transform: rotate(-180deg);
      transition: transform .4s ease-out;
    }

  }

</style>
