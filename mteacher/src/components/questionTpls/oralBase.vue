<template>
  <div class="question-main-wrapper question-main-wrapper-oral">
    <div v-if="!question.id" class="loading">loading...</div>
    <template v-else>
      <!--作答说明-->
      <div v-if="question.description" class="question-desc-wrapper title">
        <span class="description-text" v-html="question.description"></span>
      </div>
      <!--大题题干-->
      <template v-if="question.complex">
        <div class="qs-content-wrapper" v-if="question.showContent">
          <div class="qs-content" v-html="question.showContent"></div>
        </div>
      </template>

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

        if (questionType == 'oralRead') {
          questionType = 'oralWordRead';
        } else if (questionType == 'oralRoleRead') {

        } else if (questionType == 'oralFollowRead') {
          // 单词、句子、短文
          questionType = 'oralWordFollowRead';

        }
        return questionType;
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .sub-content-wrapper {
    margin-top: 0.40rem;
  }
</style>
