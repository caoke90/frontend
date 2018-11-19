
<template>
  <component :is="questionTpl" :question="question" :qindex="qindex">
  </component>
</template>
<script>
  import utils from '../utils';

  import Bus from '../marvel/bus.js';
  //录音倒计时
  import countdown from './questions/common/countdown.vue';
  Bus.addModalComponent(countdown);

  //录音失败确认框
  import confirm from './questions/common/confirm.vue';
  Bus.addModalComponent(confirm);

  import h5Audio from './questions/common/audio.js'
  Bus.h5Audio=h5Audio;

  import Step from '../utils/step'
  Bus.Step=Step;

  import {hget,hset} from '../utils/hobj'
  Bus.hget=hget;
  Bus.hset=hset;
  //暂停计时条
  window.vox.task.pauseHTML=function(isPaused){
    if (isPaused === 'true') {
      Bus.h5Audio.pause()
      Bus.curQuestion.pause();
    } else if (isPaused === 'false') {
      Bus.h5Audio.repause()
      Bus.curQuestion.repause();
    }else{
      if(isPaused){
        Bus.h5Audio.pause()
        Bus.curQuestion.pause();
      }else{
        Bus.h5Audio.repause()
        Bus.curQuestion.repause();
      }
    }

  }

  Bus.GUID=function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
  }
  //我把它定义成一个业务组件
  const component = require.context('./questions', false, /\.vue$/);
  const components = {};
  component.keys().map(component).forEach((card) => {
    components[card.name] = card;
  })

  export default {
    components,
    data(){
      return {
        //11种题型的字典
        step:{
          '000': 'oral-read', // 1、短文朗读 & 模仿朗读 & 编号: 203016000
          '001': 'oral-listen-select', // 2、听选信息 & 编号: 203016001
          '002': 'oral-answer-question', // 3、回答问题 & 编号: 203016002
          '003': 'oral-quoted', // 4、信息转述 & 编号: 203016003
          '004': 'oral-ask-information', // 5、询问信息 & 编号: 203016004
          '005': 'oral-situational-response', // 8、情景对话 & 编号: 203016005
          '006': 'oral-situational-dialogue', // 9、情景反应 & 编号: 203016006
          '007': 'oral-situational-qanswers', // 10、情景问答 & 编号: 203016007
          '008': 'oral-expression', // 11、口头表达 & 编号: 203016008
          '009': '',
          '010': 'oral-read-word', // 6、读单词 & 编号: 203016010
          '011': 'oral-read-sentence' // 7、读句子 & 编号: 203016011
        }
      }
    },
    props: ['question', 'qindex'],
    computed:{
      questionTpl: function () {
        if (!this.question) return;
        let id = this.question.oralId;
        let type = this.step[id]||'oral-read';
        console.log(type)
        return type;
      }
    },

  }
</script>
