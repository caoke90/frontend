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
    <template v-if="subQuestion.answers.length>0">
      <div class="answer-wrapper" v-for="(answer,index) in subQuestion.answers" :key="index">
        <span class="answer-index">{{index+1}}.</span>
        <component :is="answerTpl" :subQuestion="subQuestion" :answer="answer"></component>
      </div>
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
    margin-bottom: 0.30rem;
    font-size: 0.30rem;
    color: #171717;
  }

  .answer-wrapper {
    border-bottom: 1px solid rgba(230, 230, 230, 0.7);
    padding-bottom: 0.30rem;
  }

  .listen-file-wrapper {
    float: left;
  }

  .audio-text-wrapper {
    font-size: 0.30rem;
    color: #171717;
    padding:0.1rem 0 0.18rem 0;
  }

  .role-1 {
    .audio-role {
      color: #007AFF;
    }
  }

  .listen-wrapper {
    margin: 0.40rem 0 0;
  }

  .audio-text-wrapper {
    margin-left: 0.60rem;
  }
</style>
