<template>
  <div id="venusapp">
    <mv-modal></mv-modal>
    <div class="container mfont">
      <question class="box" :key="index" :question='questionList[index]' :qindex="index" ></question>
      <!--<div class="box" v-for="(v,k) in questionList" :key="k">-->
        <!--<question :question='v' :qindex="k" ></question>-->
      <!--</div>-->
    </div>
  </div>

</template>
<script>
  // 项目公用的
  require("../assets/css/common.scss")
  // ajax请求
  import ajax from '../api/ajax';
  import Bus from '../marvel/bus';
  import Question from '../models/questions';

  export default {
    data() {
      return {
        index:0,
        //题目数据列表
        questionList:[],
      }
    },
    computed:{

    },
    components: {
       question :require('../components/question')
    },

    methods: {

      next() {

        if(this.index<this.questionList.length-1){
          this.index++
        }
      },
      prev(){
        if(this.index>0){
          this.index--
        }

      },

    },
    created: async function () {
      const cache=[]
      Bus.config.questionList.forEach(function (item) {
        cache.push(new Question(item))
      })
      this.questionList=cache;
      Bus.$on('nextQuestion', () =>{
        this.next()
      })

      Bus.venus=this;
    },
    destroyed(){
      Bus.$off("nextQuestion");
    }
  }

  // 测试
  window.addEventListener('keydown',(event)=> {
    console.log(event.keyCode)
    switch(event.keyCode){
      case 79:
        window.vox.task.pauseHTML(false)
        break;
      case 80:
        window.vox.task.pauseHTML(true)
        break;
      case 40:
        Bus.curQuestion.next()
        break;
      case 37:
        Bus.venus.prev()
        break;
      case 39:
        Bus.$emit('nextQuestion')
        break;
    }
  })
</script>
<style lang="scss" scoped>
  #venusapp,.container,.box{
    width: 100%;
    height: 100%;
    background: #f2f5f6;
    overflow-y: scroll;
  }

</style>

