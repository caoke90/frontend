<template>
  <div class="question-main-content main-content-spellsentence">
    <!--题干-->
    <div class="content-wrapper">
      <div v-if="subQuestion.answers" class="content-container content-container-spellsentence">
        <div class="content-detail">
          <ul class="content-text clearfix">
            <li v-for="(ans,index) in subQuestion.answers" :key="index">
              <span class="content-text">{{subQuestion.optionPreviewList[ans]}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--文本-->

    <!--选项-->
    <div class="option-wrapper">
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
    name: "spellSentence",
    props: ['question', 'subQuestion', 'qindex'],
    data() {
      return {}
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .content-text {
    li {
      float: left;
      margin-right: 0.10rem;
      span {
        font-size: 0.36rem;
        color: #007AFF;
        letter-spacing: 0;
        line-height: 0.54rem;
        text-decoration: underline;
      }
    }
  }

  .option-preview {
    margin-bottom: 0.30rem;
    .option-list {
      li {
        float: left;
        margin-right: 0.08rem;
        margin-bottom: 0.12rem;
      }
    }
    .option-text {
      padding: 0.02rem 0.12rem;
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
