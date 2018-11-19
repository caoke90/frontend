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
          <div class="audio-text" v-html="item.text"></div>
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
    margin-top: 0.40rem;
    overflow: hidden;
    &.even-item {
      .audio-file {
        float: left;
      }
      .audio-text {
        float: left;
        margin-left: 0.20rem;
        background: #F2F8FF;
        border-radius: 0 0.3rem 0.3rem 0.3rem;
        color: #58595E;
      }
    }
    &.odd-item {
      .audio-file {
        float: right;
      }
      .audio-text {
        float: right;
        margin-right: 0.20rem;
        background: #007AFF;
        border-radius: 0.3rem 0 0.3rem 0.3rem;
        color: #FFFFFF;
      }
    }
  }

  .audio-file {
    float: left;
    width: 0.44rem;
  }

  .audio-text {
    font-size: 0.30rem;
    color: #171717;
    letter-spacing: 0;
    line-height: 0.44rem;
    display: inline-block;
    min-width: 0.4rem;
    max-width: 5rem;
    padding: 0.14rem 0.2rem;

  }
</style>
