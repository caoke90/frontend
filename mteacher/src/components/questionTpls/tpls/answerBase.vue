<template>
  <div class="answer-wrapper">
    <div v-if="answers" class="answers-container answers-container-base">
      <div class="answer-title">
        <div class="rect-block"></div>
        <div class="title-text">{{subQuestion.subContentTypeId == 18 ? '参考答案' : '答案'}}</div>
      </div>
      <div class="answer-content">
        <span class="answer-info" v-html="answers"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['subQuestion'],
    data() {
      return {
        answers: this.subQuestion.getAnswerString()
      };
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
