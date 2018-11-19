<template>
  <div class="question-main-content main-content-spellword">
    <!--题干-->
    <div class="content-wrapper sub-content-spellword">
      <div class="content-container content-container-spellword">
        <div class="content-detail">
          <div v-if="subQuestion.showContent" class="content-text">
            <mv-img :html="subQuestion.showContent"></mv-img>
          </div>
        </div>
      </div>
    </div>
    <!--文本-->
    <div v-if="question.wordName" class="word-text">{{question.wordName}}</div>
    <!--选项-->
    <div class="sub-option-wrapper sub-option-spellword">
      <div v-if="subQuestion.optionPreviewList" class="option-preview clearfix">
        <ul class="option-list clearfix">
          <li class="option-item" v-for="(item, index) in subQuestion.optionPreviewList" :key="index">
            <span v-html="item" class="option-text"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "spellWord",
    props: ['question', 'subQuestion', 'qindex'],
    data() {
      return {}
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .word-text {
    font-size: 0.36rem;
    color: #171717;
    letter-spacing: 0;
    line-height: 0.54rem;
  }

  .sub-option-wrapper {
    margin-top: 0.30rem;
  }

  .option-preview {
    margin-bottom: 0.30rem;
    .option-list {
      li {
        float: left;
        margin-right: 0.08rem;
        margin-bottom: 0.18rem;
      }
    }
    .option-text {
      padding: 0.01rem 0.12rem;
      border: 1px solid #CCCCCC;
      border-radius: 3px;
      opacity: 1;
      font-size: 0.30rem;
      color: #58595E;
      letter-spacing: 0;
      line-height: 0.36rem;
    }
  }
</style>
