<template>
  <div class="answer-wrapper">
    <div class="answers-container answers-container-list">
      <div class="answer-title">
        <div class="rect-block"></div>
        <div class="title-text">答案</div>
      </div>
      <div class="answer-content">
        <template v-if="answers">
          <ul class="answer-list">
            <li class="answer-item" v-for="(item, index) in answers" :key="index">
              <span class="answer-info" v-html="item"></span>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['subQuestion'],
    data() {
      return {
        answers: this.subQuestion.getAnswerList()
      };
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
