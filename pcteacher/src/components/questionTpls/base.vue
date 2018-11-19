<template>
  <div class="question-main-wrapper question-main-wrapper-base">
    <div :class="{'listen-wrapper':question.listenUrl}">
      <!--听力材料-->
      <div v-if="question.listenUrl" class="listen-file-wrapper">
        <component :listen-seconds="question.listenSeconds" :listen-url="question.listenUrl" :is="audioTpl"></component>
      </div>
      <!--听力原文-->
      <div v-if="question.listenUrl && question.contentDesc" class="content-desc-wrapper">
        <div class="content-desc-title">听力原文 :</div>
        <div class="content-desc-text" v-html="question.contentDesc"></div>
      </div>
    </div>
    <!--大题题干-->
    <template v-if="question.complex">
      <div class="qs-content-wrapper" v-if="question.showContent">
        <div class="qs-content" v-html="question.showContent"></div>
      </div>
    </template>

    <!--复合题-->
    <template v-if="question.complex">
      <div class="question-complex unexpanded">
        <div class="subq-list">
          <div class="subq-item" v-for="(subq, subqIndex) in question.subQuestions" :key="subqIndex">
            <component :is="getQuestionType(subq.subContentTypeId)" :question="question"
                       :subQuestion="subq"
                       :key="subqIndex" :qindex="subqIndex"></component>
          </div>
        </div>
      </div>
    </template>
    <!--非复合题-->
    <template v-else>
      <div class="question-single" v-if="question.subQuestions">
        <component :is="getQuestionType(question.subQuestions[0].subContentTypeId)" :question="question"
                   :subQuestion="question.subQuestions[0]" :qindex="qindex"></component>
      </div>
    </template>
  </div>
</template>
<script>
  import {id2name} from '../../common/js/questionUtils';
  import audioComponent from '../audio';

  const components = {audioComponent: audioComponent};
  const component = require.context('./', false, /.*\.vue$/);
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

        // TODO 特殊题型渲染，需加入新题型
        let choiceBlankType = {
          2031023: 'spellWord', // 单词拼写
          2031025: 'spellSentence', // 句子拼写
          // 新题型
          203017000: 'spellWord', // 单词拼写
          203017004: 'spellSentence', // 句子拼写
        };
        let choiceType = {
          2030014: 'enToCn', // 英译中
          2030015: 'enToCn', // 中译英（和英译中展示一样，先直接用了）
          // 新题型
          203017002: 'enToCn', // 英译中
          203017001: 'enToCn', // 中译英
        };

        if (questionType == 'choice') {
          if (questionType2Id in choiceType) {
            questionType = choiceType[questionType2Id];
          }
        } else if (questionType == 'choiceBlank') {
          if (questionType2Id in choiceBlankType) {
            questionType = choiceBlankType[questionType2Id];
          }
        }
        return questionType;
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

</style>
