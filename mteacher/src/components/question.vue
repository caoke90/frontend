<template>
  <div class="question-wrapper" :data-id="question.id">
    <toggle :card="question">
      <div class="question-container">
        <div class="header clearfix">
          <div class="check-btn-wrapper">
            <div class="check-btn remove" v-if="question.selected" @click="toggle">移除</div>
            <div class="check-btn" v-else @click="toggle">选入</div>
          </div>
          <div class="top-info">
            <template v-if="question.showTagsList.length">
              <span class="tag" :class="[tagItem.type]" v-for="(tagItem,tagIndex) in question.showTagsList"
                    :key="tagIndex">{{tagItem.text}}</span>
            </template>
            <span class="info" v-text="question.showTypeTitle"></span>
          </div>
        </div>
        <div class="main">
          <component :question="question" :is="questionTpl" :qindex="qindex" ref="base">
          </component>
        </div>
        <div class="footer clearfix">
          <div class="feedback" @click="feedback">题目反馈</div>
        </div>
      </div>
    </toggle>
  </div>
</template>

<script>

  import Cart from '../api/cart';
  import toggle from './cards/toggle';
  import baseQuestion from './questionTpls/base';
  import oralBase from './questionTpls/oralBase';
  import oralBasicBase from './questionTpls/oralBasicBase';
  import {questionFeedback} from '../common/js/external/teacher';
  import {stopAudio} from '../common/js/external/audio';
  import log from '../common/js/utils/logConfig';
  import {sendLog} from '../common/js/logger';
  import Bus from '../marvel/bus';

  export default {
    props: ['question', 'qindex', 'bagtype'],
    components: {toggle, baseQuestion, oralBase, oralBasicBase},
    provide() {
      return {
        showConfig: this.showConfig
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
          Bus.$emit('Cart', {
            type: 'add_questions',
            ques: this.question
          });

          // 根据页面page打单个题目选入的点
          if (this.bagtype && (this.bagtype === 'frequentPackage')) {
            sendLog(log.module.m_frequent, log.op.frequent_question_select, {s0: 'english', s1: this.question.id});
          }
          // 打点
          if (this.bagtype && (this.bagtype === 'lspdetail')) { // 听说套卷
            sendLog(log.module.m_listenRead, log.op.ls_detail_select, {
              s0: 'english',
              s1: '套卷',
              s2: '选入',
              s3: this.question.id
            });
          }
          if (this.bagtype && (this.bagtype === 'lssdetail')) { // 听说专项
            sendLog(log.module.m_listenRead, log.op.ls_detail_select, {
              s0: 'english',
              s1: '专项',
              s2: '选入',
              s3: this.question.id
            });
          }

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
          Bus.$emit('Cart', {
            type: 'remove_questions',
            ques: this.question
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
        questionFeedback({question_id: this.question.id});

        // 打点
        if (this.bagtype && (!!~['lspdetail', 'lssdetail'].indexOf(this.bagtype))) { // 听说套卷&听说专项
          sendLog(log.module.m_listenRead, log.op.ls_detail_wrong_click, {s0: 'english', s1: this.question.id});
        }
      }
    },
    watch: {
      'question': function (val, old) {
        let currentContentType = this.getQuestionType(val);

        this.questionTpl = '';
        this.$nextTick(() => {
          this.questionTpl = currentContentType;
        });
      }
    },
    created() {
      this.questionTpl = this.getQuestionType(this.question);
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .question-container {
    background: #FFFFFF;
    padding: 0.4rem;
    position: relative;
    .header {
      margin-bottom: 0.18rem;
      .check-btn-wrapper {
        float: right;
        width: 1.3rem;
      }
      .top-info {
        margin-right: 1.3rem;
        padding-top: 0.1rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .tag {
          display: inline-block;
          padding: 0 0.09rem;
          margin-right: 0.2rem;
          border: 1px solid #4BA0FF;
          border-radius: 0.04rem;
          color: #4BA0FF;
          font-size: 0.22rem;
          line-height: 0.32rem;
          &.used {
            border-color: #159CFC;
            color: #159CFC;
          }
          &.mark {
            border-color: #fa7252;
            color: #fa7252;
          }
          &.loss-rate {
            border-color: #FF4444;
            color: #FF4444;
          }
        }
        .redtag {
          border: 1px solid #FF0000 !important;
          color: #FF0000 !important;
        }
        .info {
          line-height: 0.4rem;
          font-size: 0.28rem;
          margin-bottom: 0.2rem;
          color: #58595E;
        }

      }
    }
    .main {
      min-height: 0.4rem;
    }
    .footer {
      height: 0.36rem;
      .feedback {
        float: right;
        font-size: 0.24rem;
        color: #9D9FA1;
        line-height: 0.36rem;
      }
    }
  }
</style>

<style rel="stylesheet/scss" type="text/css" lang="scss">
  /*.question-wrapper{
    .content-text p{
       display:inline;
    }
    .content-text p img{
       display:block;
    }
    li{
      list-style:none;
    }
  }*/
</style>
