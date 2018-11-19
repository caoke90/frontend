<template>
  <div class="question-wrapper" :data-id="question.id">
    <div class="question-container">
      <div class="header clearfix">
        <div class="top-info">
          <span class="info-wrapper">
            <template v-if="question.showTagsList.length">
              <span class="tag" :class="[tagItem.type]" v-for="(tagItem,tagIndex) in question.showTagsList"
                    :key="tagIndex">{{tagItem.text}}</span>
            </template>
            <span class="info" v-html="question.showTypeTitle"></span>
          </span>
          <span class="knowledge-points-wrapper" v-if="question.knowledgePointsStr"
                v-popover:fadeIn="question.knowledgePointsStr">
            <span class="knowledge-points-content"> / {{question.knowledgePointsStr}}</span>
          </span>
        </div>
      </div>
      <div class="main">
        <component :question="question" :is="questionTpl" :qindex="qindex" ref="base">
        </component>
      </div>
      <div class="footer clearfix">
        <div class="right clearfix">
          <div class="analysis-btn" v-if="showAnalysisBtn" @click="analysisToogle">
            {{this.question.showAnswerAnalysis?'隐藏解析':'显示解析'}}
          </div>
          <div class="feedback" @click="feedback">题目反馈</div>
        </div>
        <div class="check-btn-wrapper">
          <div class="check-btn remove" v-if="question.selected" @click="toggle">- 移除</div>
          <div class="check-btn add" v-else @click="toggle">+ 选入</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 题目的公共样式
  require('../common/scss/question.scss');

  import Cart from '../api/cart';
  import Bus from '../marvel/bus.js';
  import toggle from './cards/toggle';
  import baseQuestion from './questionTpls/base';
  import oralBase from './questionTpls/oralBase';
  import oralBasicBase from './questionTpls/oralBasicBase';
  import {stopAudio} from '../common/js/external/audio';
  import sa from '@/utils/sensorsdata';
  
  Bus.addModalComponent(require('./questionFeedback.vue'))
  export default {
    props: ['question', 'qindex'],
    components: {toggle, baseQuestion, oralBase, oralBasicBase},
    provide() {
      return {
        showConfig: this.showConfig
      }
    },
    computed: {
      showAnalysisBtn() {
        // 不显示解析的题型
        let noAnalysisType = [203017003, 203017005, 203017006, 203017007, 203017010, 203016010, 203016011, 203016000/*, 203017008*/]; // 新题型：单词跟读、例句跟读、句子跟读、逐句跟读、段落朗读、读单词、读句子、短文朗读、情景对话
        if (noAnalysisType.includes(this.question.questionType2Id)) {
          return false;
        }
        if (this.question.subQuestions.length) {
          return this.question.subQuestions[0].answers.length > 0;
        }
        return false;
      }
    },
    data() {
      return {
        questionTpl: '',
        showConfig: {
          showIndex: false,
          showDescription: false
        }
      };
    },
    methods: {
      toggle() {
        if (this.question.selected) {
          this.removeQuestion();
        } else {
          this.addQuestion();
        }
      },
      addQuestion() {
        if (Cart.oriCardInfo) {
          this.question.selected = true;
          // Cart.add_questions(this.question)
          Bus.$emit('Cart',{
            type:'add_questions',
            ques:this.question
          })
        }
      },
      removeQuestion() {
        if (Cart.oriCardInfo) {
          this.question.selected = false;
          // 预览界面，移除题目时候音频不停止
          if (window.listenUrl) {
            console.log("暂停最后一个音频", window.listenUrl);
            stopAudio(window.listenUrl);
          }
          // Cart.remove_questions(this.question)
          Bus.$emit('Cart',{
            type:'remove_questions',
            ques:this.question
          })
        }
      },
      getQuestionType(question) {
        let currentContentType = '';
        if (question) {
          if (question.isOral()) {
            currentContentType = 'oralBase';
          } else if (question.isBasicOral()) {
            currentContentType = 'oralBasicBase';
          } else {
            currentContentType = 'baseQuestion';
          }
        }
        return currentContentType;
      },
      feedback() {
        Bus.questionFeedback.init({id: this.question.id});
      },
      analysisToogle() {
        this.question.showAnswerAnalysis = !this.question.showAnswerAnalysis;
      }
    },
    watch: {
      'question': function (val, old) {
        let currentContentType = this.getQuestionType(val);

        this.questionTpl = '';
        this.$nextTick(() => {
          this.showAnalysis = false;
          this.questionTpl = currentContentType;
        });
      }
    },
    created() {
      this.questionTpl = this.getQuestionType(this.question);
    },
    mounted() {
      let infoWrapper = this.$el.querySelector('.info-wrapper');
      let topInfo = this.$el.querySelector('.top-info');
      let knowledgePointsWidth = (topInfo.offsetWidth - infoWrapper.offsetWidth);
      let knowledgePointsContent = this.$el.querySelector('.knowledge-points-content');
      if (knowledgePointsContent) {
        knowledgePointsContent.style.width = (knowledgePointsWidth - 5) + 'px';
      }
    }
  }
</script>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .question-container {
    position: relative;
    background: #FFFFFF;
    border: 1px solid #DBE6EE;
    padding: 20px 20px 0;
    &:hover {
      border-color: #159CFC;
      .analysis-btn{
        visibility: visible;
      }
    }
    .header {
      line-height: 20px;
      font-size: 14px;
      color: #7F7E7E;

      .top-info {
        width: 100%;
        height: 20px;
        white-space: nowrap;
        span {
          display: inline-block;
          vertical-align: middle;
        }
        .tag {
          display: inline-block;
          padding: 0 5px;
          margin-right: 10px;
          background: #FFFFFF;
          border: 1px solid #159CFC;
          border-radius: 2px;
          color: #159CFC;
          font-size: 12px;
          height: 20px;
          line-height: 18px;
          &.used {
            border-color: #159CFC;
            color: #159CFC;
          }
          &.mark {
            border-color: #fa7252;
            color: #fa7252;
          }
          &.loss-rate{
            border-color: #FF4444;
            color: #FF4444;
          }
        }
        .info {

        }
      }
    }
    .main {
      margin-top: 14px;
      margin-bottom: 50px;
    }
    .footer {
      position: absolute;
      left: 20px;
      right: 0;
      bottom: 0;
      .right {
        float: right;
        margin-right: 60px;
        .analysis-btn, .feedback, .check-btn-wrapper {
          display: inline-block;
        }
        .analysis-btn, .feedback {
          padding: 8px 5px;
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" type="text/css" lang="scss">
  .knowledge-points-wrapper {
    position: relative;
    height: 20px;
    line-height: 20px;
    .knowledge-points-content {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    p {
      white-space: normal;
      word-break: break-all;
      margin: 0 0 0 80px !important;
    }
  }
</style>
