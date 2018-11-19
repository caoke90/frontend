<template>
  <div class="question-main-content main-content-oralbasic-dialogues">
    <!--音频-->
    <template v-if="subQuestion.options">
      <ul>
        <li v-for="(item,index) in subQuestion.options" :key="index"
            :class="[index%2===0?'even-item':'odd-item']" class="audio-item clearfix">
          <div class="audio-file">
            <component :listen-url="item.listenFileUrl" :simpleAudio="simpleAudio" :is="audioTpl"></component>
          </div>
          <div class="audio-text-wrapper">
            <div class="audio-text" v-html="item.text"></div>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
  import audioTpl from '../../audio';

  export default {
    name: "oralBasicDialogues",
    props: ['question', 'subQuestion', 'qindex'],
    components: {audioTpl},
    data() {
      return {
        audioTpl: 'audioTpl',
        simpleAudio: true
      };
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .audio-item {
    margin-top: 20px;
    overflow: hidden;
    &.even-item {
      .audio-text {
        background: #F0F8FF;
        color: #555555;
      }
    }
    &.odd-item {
      .audio-text {
        background: #159CFC;
        color: #FFFFFF;
      }
    }
  }

  .audio-file {
    float: left;
    width: 34px;
  }

  .audio-text-wrapper {
    margin-left: 34px;
  }

  .audio-text {
    max-width: 90%;
    font-size: 16px;
    color: #171717;
    letter-spacing: 0;
    line-height: 20px;
    padding: 8px 10px;
    border-radius: 0 8px 8px 8px;
    display: inline-block;
  }
</style>
