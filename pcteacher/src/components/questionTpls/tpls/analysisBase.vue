<template>
  <div class="analysis-wrapper">
    <div v-if="subQuestion.analysis" class="analysis-container analysis-base">
      <div class="analysis-title">
        <div class="title-text">解析:</div>
      </div>
      <div class="analysis-content">
        <span class="analysis-info" v-html="subQuestion.analysis"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['subQuestion']
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
