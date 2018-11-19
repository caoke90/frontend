<template>
  <div class="answer-wrapper">
    <div v-if="answers" class="answers-container"
         :class="[isArray(answers) ? 'answers-container-list' : 'answers-container-base',titleLong?'title-long':'']">
      <div class="answer-title">
        <div class="title-text">{{titleLong ? '参考答案' : '答案'}}:</div>
      </div>
      <div class="answer-content">
        <template v-if="isArray(answers)">
          <ul class="answer-list">
            <li class="answer-item" v-for="(item, index) in answers" :key="index">
              <span class="answer-info" v-html="item"></span>
            </li>
          </ul>
        </template>
        <template v-else>
          <span class="answer-info" v-html="answers"></span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import {isArray} from '../../../common/js/utils';
  import {strlen} from '../../../common/js/utils/StringUtils';

  export default {
    props: {
      subQuestion: {
        type: Object,
        default: function () {
          return null;
        }
      },
      showMode: {   // 答案展示模式
        type: String,
        default: 'auto'   // row: 一行显示， list: 换行显示，auto：根据答案最大长度决定显示方式
      }
    },
    data() {
      let answers = null;
      if (this.showMode == 'list' && this.subQuestion.getAnswerList) {
        answers = this.subQuestion.getAnswerList();
      } else if (this.showMode == 'row' && this.subQuestion.getAnswerString) {
        answers = this.subQuestion.getAnswerString();
      } else {
        if (this.subQuestion.getAnswerList) {
          // 根据答案长度选择展示方式
          let answerMaxLen = 0;
          let answerList = this.subQuestion.getAnswerList();
          for (let i = 0; i < answerList.length; i++) {
            let answerLen = strlen(answerList[i]);
            if (answerLen > answerMaxLen) {
              answerMaxLen = answerLen;
            }
          }
          if (answerMaxLen < 20 && this.subQuestion.getAnswerString) {
            answers = this.subQuestion.getAnswerString();
          } else {
            answers = answerList;
          }
        } else {
          answers = this.subQuestion.getAnswerString();
        }
      }
      return {
        answers: answers,
        titleLong: this.subQuestion.subContentTypeId == 18
      };
    },
    methods: {
      isArray: isArray
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .title-long {
    .answer-title {
      width: 70px !important;
    }
    .answer-content {
      margin-left: 70px !important;
    }
  }
</style>
