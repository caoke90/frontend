<template>
  <div class="container">
    <div id="questionArea" v-show="isshow">

      <!-- 题型选择 -->
      <p>题型选择</p>
      <label>口语题型:&nbsp;&nbsp;&nbsp;&nbsp;<select v-model="questionId">
          <option value="">全部题型</option>
          <option v-for="(arr, idx) in questionArr" :value="arr.id">{{arr.frontShowName}}</option>
      </select></label>

      <!-- 题型配置 -->
      <p>题型配置</p>
      <ul>
        <li><label>口语模式:&nbsp;&nbsp;&nbsp;&nbsp;<select v-model="homeworkMode">
              <option :value="false">考试模式</option>
              <option :value="true">作业模式</option>
        </select></label></li>

        <li style="font-size: 12px;">
          新需求，后续添加...
        </li>
      </ul>

      <button @click="start">确认</button>
    </div>
    <div id="venusapp"></div>
  </div>
</template>

<script>
  import Venus from '../entry/venus';
  import axios from 'axios';

  export default {
    data() {
      return {
        isshow: true,
        questionId: '',
        questionArr: [],
        homeworkMode: false
      }
    },
    computed: {},
    methods: {
      start(){
        this.isshow = false;
        this.runApp();
      },
      runApp() {
        let questionList = this.questionArr;

        // 方便单道题调试
        if (this.questionId) {
          questionList = questionList.filter((a) => this.questionId == a.id)
        }

        Venus.init({
          el: '#venusapp',
          questionList: questionList,
          startIndex: 0,
          subIndex:0,
          homeworkMode: true,
          fetchQuestion: function(){
          },
          onNext(index, isAuto){
            console.log('onnext')
            console.log(index, isAuto)
          },
          onPrev(index, isAuto){
            console.log('onprev')
            console.log(index, isAuto)
          },
          onResult: function(data){
            //返回结果时调用
            console.log('onresult')
            console.log(data)
          },
          onRecordStart: function(){
            // 开始录音
            console.log('onRecordStart');
          },
          onRecordStop: function(recordTime, stopType){
            // 停止录音
            console.log('onRecordStop', recordTime, stopType);
          },
          onRecordSuccess: function(score, result){
            // 录音成功
            console.log('onRecordSuccess', score, result);
          },
          onRecordError: function(errorCode){
            // 录音失败
            console.log('onRecordError', errorCode);
          },
          onRecordAgainClick: function(){
            // 再录一遍按钮被点击
            console.log('onRecordAgainClick');
          },
          onOralPlayback: function(questionId, subQuestionIndex){
            // 交卷前点击回放录音按钮
            console.log('onOralPlayback', questionId, subQuestionIndex);
          },
          onPlayAudio: function(audioUrl){
            // 准备播放录音前的回调
            console.log('onPlayAudio', audioUrl);
            // return false;
          },
          onQuestionRender: function(index,qobj,success){
            console.log('onQuestionRender',index);
          }
        })
      },
      init:function () {
        axios.get('/venus/practiceQuestion').then((resp)=>{
          const arr=[]
          for(var k in resp.data.data){
            const question=resp.data.data[k]
            if(question.localTypeObj){
              for(var key in question.selectLocalTypeObj){
                if(key != 'questions' && key != 'id'){
                  question[key] = question.selectLocalTypeObj[key];
                }
                if(key == 'id'){
                  question['localTypeId'] = question.selectLocalTypeObj[key];
                }
              }
              question.content.subContents.forEach(function(onesubcontent,index){
                for(var key in question.selectLocalTypeObj){
                  if(key == 'questions'){
                    question.selectLocalTypeObj.questions.forEach(function (subcontentlocal,indexlocal) {
                      if(index == indexlocal){
                        for(var keylocal in subcontentlocal){
                          onesubcontent[keylocal] = subcontentlocal[keylocal]
                        }
                      }
                    })
                  }
                }
              })
            }
            arr.push(question)
          }

          this.questionArr = arr;

        })
      }
    },
    created: function () {
      this.init();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

  #questionArea{
    font-size: 16px;
    padding: 0 12px;
    p {
        font-size: 16px;
        text-align: center;
        margin: 10px 0;
    }
    ul{
      margin-top: 10px;
          padding: 0;
        li{
          list-style: none;
          padding: 4px 0;
        }
    }
    button{
      margin: 10px auto;
      display: block;
      font-size: 20px;
      padding: 10px 20px;
      background-color: gray;
      color: white;
      border: none;
      border-radius: 10px;
    }
  }


</style>
