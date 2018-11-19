<template>
  <div class="question-main-wrapper question-main-wrapper-oralbasic">
    <div v-if="!question.id" class="loading">loading...</div>
    <template v-else>
      <!--大题题干-->
      <div class="qs-content-wrapper" v-if="question.showContent">
        <div class="qs-content" v-html="question.showContent"></div>
      </div>

      <!--听力材料-->
      <template v-if="question.listenUrl">
        <div :class="{'listen-wrapper':question.listenUrl}">
          <div class="listen-file-wrapper">
            <component :listen-url="question.listenUrl" :is="audioTpl"></component>
          </div>
          <div v-if="question.contentDesc" class="content-desc-wrapper">
            <div class="content-desc-title">听力原文</div>
            <div class="content-desc-text" v-html="question.contentDesc"></div>
          </div>
        </div>
      </template>

      <!--小题列表-->
      <div class="subq-list">
        <div class="subq-item" v-for="(subq, subqIndex) in question.subQuestions">
          <component :is="getQuestionType(subq.subContentTypeId)" :question="question"
                     :subQuestion="subq" :key="subqIndex" :qindex="subqIndex"></component>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import {id2name} from '../../common/js/questionUtils';
  import audioComponent from '../audio';

  const components = {audioComponent: audioComponent};
  const component = require.context('./oral/', false, /.*\.vue$/);
  component.keys().map(component).forEach((questionComponent) => {
    if (questionComponent.name) {
      components[questionComponent.name] = questionComponent;
    }
  });

  export default {
    props: ['question', 'subQuestion', 'qindex'],
    components,
    provide() {
      return {
        question: this.question
      }
    },
    inject: ['showConfig'],
    data() {
      return {
        audioTpl: 'audioComponent'
      }
    },
    methods: {
      getQuestionType(subContentTypeId) {
        let questionType2Id = this.question.questionType2Id;
        let questionType = id2name(subContentTypeId, this.question);

        let wordFollowRead = [2031027, 2030035]; // 句子跟读、逐句跟读
        let wordFollowReadNew = [203017006, 203017007]; // 新题型：  句子跟读
        // TODO 句子跟读、逐句跟读 没有图片
        let wordFollowReadArray = [].concat(wordFollowRead, wordFollowReadNew);


        let wordFollowReadPic = [2030047, 2030048]; // 单词跟读、例句跟读
        let wordFollowReadPicNew = [203017003, 203017005]; // 新题型：  单词跟读、例句跟读
        // TODO 单词跟读和例句跟读有图片
        let wordFollowReadPicArray = [].concat(wordFollowReadPic, wordFollowReadPicNew);


        if (questionType == 'oralBasicFollowRead') {
          if (wordFollowReadPicArray.includes(questionType2Id)) {
            // 单词、例句
            questionType = 'oralBasicWordFollowReadPic';
          } else if (wordFollowReadArray.includes(questionType2Id)) {
            // 句子、逐句
            questionType = 'oralBasicWordFollowRead';
          } else if ([2030069, 203017010].includes(questionType2Id)) { // TODO 段落朗读题型
            // 段落
            questionType = 'oralBasicParagraphRead';
          } else {
            // 默认
            questionType = 'oralBasicWordFollowRead';
          }
        }
        return questionType;
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  @import "../../common/scss/common";

  .qs-content {
    @extend .mfont;
    font-size: 0.36rem;
    line-height: 0.54rem;
  }

  .subq-list {
    .subq-item {
      .question-main-content {
        padding: 0;
        border-bottom: none;
      }
    }
  }
</style>
