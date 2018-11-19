<template>
  <div class="option-wrapper">
    <div v-if="subQuestion.options" class="options-container options-container-choice">
      <ul class="option-list">
        <li class="option-item"
            :class="[item.isCorrectAnswer ? 'correct' : '', subQuestion.optionType=='img' ? 'option-type-img' : 'option-type-text']"
            v-for="(item, index) in subQuestion.options"
            :key="index">
          <div class="option-index"><span>{{item.showIndex}}.</span></div>
          <div class="option-content">
          <span>
            <mv-img :html="item.option"></mv-img>
          </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['subQuestion'],
    methods: {}
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  @import "../../../common/scss/common";

  .option-item {
    position: relative;
    margin-bottom: 0.04rem;
    font-size: 0.28rem;
    color: #58595E;
    line-height: 0.4rem;
    overflow: hidden;
    &.option-type-img {
      display: table;
      vertical-align: middle;
      .option-index {
        position: absolute;
        top: 50%;
        margin-top: -0.20rem;
      }
    }

    &.checked {
    }
    &.correct {
      @extend .bfont;
      color: #007AFF;
    }
    &.error {
    }
  }

  .option-index {
    float: left;
    width: 0.35rem;
  }

</style>

<style rel="stylesheet/scss" type="text/css" lang="scss">
  .question-container .question-main-content .option-wrapper .options-container-choice {
    .option-list {
      .option-item {
        .option-content {
          img {
            margin-left: 0.35rem;
          }
        }
      }
    }
  }
</style>
