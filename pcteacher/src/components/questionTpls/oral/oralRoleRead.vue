<template>
  <div class="question-main-content main-content-oral-role-read">
    <!--音频-->
    <template v-if="subQuestion.options">
      <div class="content-wrapper">
        <ul>
          <li v-for="(item,index) in subQuestion.options" :key="index"
              :class="[item.roleType==2?'role-2':'role-1']" class="audio-item clearfix">
            <div class="listen-wrapper">
              <div v-if="item.roleType==2" class="listen-file-wrapper">
                <component :listen-url="item.listenFileUrl" :simpleAudio="simpleAudio" :is="audioTpl"></component>
              </div>
              <div class="audio-text-wrapper">
                <span class="audio-role">{{item.name}}:&nbsp;</span>
                <span class="audio-text" v-html="item.text"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
    <!--答案-->
    <template v-if="subQuestion.answers">
      <transition name="fade">
        <div class="answer-analysis-wrapper" v-show="question.showAnswerAnalysis">
          <!--答案-->
          <div class="answer-wrapper" v-for="(answer,index) in subQuestion.answers" :key="index">
            <span class="answer-index">{{index+1}}.</span>
            <component :is="answerTpl" :subQuestion="subQuestion" :answer="answer"></component>
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
  import audioTpl from '../../audio';
  import answerTpl from '../tpls/oralRoleReadAnswer';

  export default {
    name: "oralRoleRead",
    props: ['question', 'subQuestion', 'qindex'],
    components: {audioTpl, answerTpl},
    inject: ['showConfig'],
    data() {
      return {
        audioTpl: 'audioTpl',
        answerTpl: 'answerTpl',
        simpleAudio: true
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .answer-index {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 14px;
    color: #171717;
  }

  .answer-wrapper {
    /*border-bottom: 1px solid rgba(230, 230, 230, 0.7);*/
    padding-bottom: 10px;
  }

  .listen-file-wrapper {
    float: left;
  }

  .audio-text-wrapper {
    font-size: 14px;
    color: #171717;
    padding: 5px 0;
  }

  .role-1 {
    .audio-role {
      color: #159CFC;
    }
  }

  .listen-wrapper {
    margin: 10px 0 0;
  }

  .audio-text-wrapper {
    margin-left: 34px;
  }
</style>
