<template>
  <div v-if="answer" class="answers-container answers-container-base">
    <div class="answer-title">
      <div class="title-text">答案 :</div>
    </div>
    <div class="answer-content">
      <span class="answer-info" v-html="answer"></span>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['subQuestion', 'answer'],
    data() {
      return {};
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
