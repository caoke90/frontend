<!--
    @action: 题目的标题栏，当前只显示第几题、题目、分值，没有特殊功能；
-->

<template>
  <div class="header">
    <div class="title-bar">
      <span>第{{ qindex+1 }}大题</span>
      <span v-if="question.frontShowName">{{ question.frontShowName }}</span>
      <span v-if="question.meSubQuestionCount && question.meSubQuestionCount==1 && question.meQuestionAllScore">（{{ question.meQuestionAllScore }}分）</span>
      <!-- 复合题显示小题数 -->
      <span v-if="question.meSubQuestionCount && question.meSubQuestionCount>=2 && question.meQuestionAllScore">（{{ question.meSubQuestionCount }}题，共{{ question.meQuestionAllScore }}分）</span>
    </div>
    <!-- div模拟0.5px -->
    <div class="line05"></div>
  </div>
</template>

<script>
  export default {
    'name': 'oral-question-header',
    data () {

      return {

      }
    },

    props: ['question', 'qindex'],
    'methods': {},
    created:function () {

    }
  }
</script>
<style lang="scss">
  .header {
    width: 100%;
    height: 59px;
    .title-bar {
      padding: 0;
      height: 58px;
      color: #444;
      font-size: 15px;
      background: #fff;
      line-height: 59px;
      padding-left: 15px;
      font-family: 'PingFangSC-Regular';
      letter-spacing: -0.36px;
      span {
        float: left;
      }
      :first-child {
        padding-right: 5px;
      }
    }
    .line05{
      height: 1px;
      transform: scaleY(0.5/2);
    }
  }

</style>
