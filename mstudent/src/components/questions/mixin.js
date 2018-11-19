
import Bus from '../../marvel/bus';
import {startRecord,stopRecord} from '../../utils/record.js';

export default {

  props: ['question', 'qindex'],
  data () {

    return {
      runArr:['listenGuide','readingTime','playQuestion','wait2Second','playSmallQuestion','readingTimeSmallQuestion','beforeRecord','startRecord','stopRecord','nextQuestion'],
      progress:{}, //进度控制器
      GUID:'',// 录音id
      subContents: this.question.subContents,  // 大题
      questionIdx: -1, // 当前播放小题索引
      dialogIdx: -1, // 当前播放情景小题索引
      result: [],
      // 样式相关
      showContent:false, //显示中间题干
      questionPlaying:false,// 题干播放中
      smallquestionPlaying:false, // 小题播放中
    };
  },
  components: {
    'oral-question-header': require('./common/oralQuestionHeader.vue'),
    'oral-question-descbar': require('./common/oralQuestionDescbar.vue'),
    'oral-question-footer': require('./common/oralQuestionFooter.vue'),
  },
  methods: {
    init:function(){
      this.progress=new Bus.Step(this.runArr,(step,time)=>{
        console.log(step)
        if(step=='readingTime'){
          this.showContent=true;
        }else if(step=='playQuestion'){
          this.questionPlaying=true;
        }else if(step=='playSmallQuestion'){
          this.smallquestionPlaying=true;
        }else if(step=='readingTimeSmallQuestion'){
          this.smallquestionPlaying=false;
          this.questionPlaying=false;
        }
        this[step](step,time);
      })
      this.progress.run();
      this.questionIdx=-1;
    },
    // 播放答题指导语音频，显示答题指导语文本，显示所有问题
    listenGuide(step,time){
      console.log(this.question.chapInfos)
      const chap=this.question.chapInfos[time-1]
      if(chap){
        this.$refs.descbar.show(chap.chapInfo)
        if(chap.chapInfoUrl){
          Bus.h5Audio.play({
            url:chap.chapInfoUrl,
          })
        }
        this.$refs.footer.init(1,chap.seconds)
        this.progress.waitSecondAndGo(chap.seconds)
      }else{
        this.progress.next()
      }

    },
    // 准备时间倒计时
    readingTime(){
      this.$refs.descbar.hide()
      this.$refs.descbar.changeAudioEnd(true)
      this.isPlaying=false;
      this.$refs.footer.init(2,this.question.prepareTimeBefore)
      this.progress.waitSecondAndGo(this.question.prepareTimeBefore)
    },

    // 播放题干音频
    playQuestion(step,time){
      this.$refs.descbar.hide()
      this.$refs.descbar.changeAudioEnd(true)
      this.$refs.footer.init(3,this.question.listenSeconds)
      if(this.question.listenUrl){
        Bus.h5Audio.play({
          url:this.question.listenUrl,
        })
        if(this.question.shortTextPlays>1){
          this.$refs.footer.title='请听题（第'+time+'遍）';
        }
      }
      this.progress.waitSecondAndGo(this.question.listenSeconds)
    },
    // 题干音频中间停留2秒
    wait2Second(step,time){
      if(time<this.question.shortTextPlays){
        this.progress.waitSecondAndGo(2,'playQuestion')
      }else{
        this.progress.next()
      }
    },

    // 播放小题
    playSmallQuestion(step,time){

      this.questionIdx++;
      if(this.questionIdx<this.question.subContents.length){
        const chap=this.question.subContents[this.questionIdx]
        if(chap.listenFileUrl||chap.listenUrl){
          Bus.h5Audio.play({
            url:chap.listenFileUrl||chap.listenUrl,
          })
        }
        this.$refs.footer.init(3,chap.listenSeconds)
        this.progress.waitSecondAndGo(chap.listenSeconds)
      }else{
        this.progress.go('nextQuestion')
      }

    },
    // 小题准备时间
    readingTimeSmallQuestion(){
      const chap=this.question.subContents[this.questionIdx]
      this.$refs.footer.init(4,chap.readySeconds)
      this.progress.waitSecondAndGo(chap.readySeconds)
    },
    // 开始录音,3秒倒计时
    beforeRecord(){
      this.$refs.descbar.changeAudioEnd(true)
      this.$refs.footer.init(5)
      Bus.countdown.show(3)
      const chap=this.question.subContents[this.questionIdx]
      if(chap.beginListenUrl){
        Bus.h5Audio.play({
          url:chap.beginListenUrl,
        })
      }
      this.progress.waitSecondAndGo(3)

    },
    // 开始录音，录音倒计时
    startRecord(){
      Bus.countdown.show(0)
      const chap=this.question.subContents[this.questionIdx]
      this.$refs.footer.init(8,chap.recordSeconds)

      this.GUID=Bus.GUID()
      //根据二级题型来确定打分字符串和打分模式
      startRecord(this.GUID,chap.jsgf,'A', (result)=> {
        this.success(result)
      }, (errorText,errorCode)=>{
        this.error(errorText,errorCode)
      })
      this.progress.waitSecondAndGo(chap.recordSeconds)
    },

    //点击停止录音，进入下一步pauseHTML
    stopRecord:function(){
      if(this.GUID){
        stopRecord(this.GUID)
        this.GUID='';
      }

      this.$refs.footer.init(6,0)
    },
    //录音成功
    success(result){
      this.result.push(result);
      this.$refs.footer.init(7,0)
      this.progress.go('playSmallQuestion')

    },
    //录音失败
    error(errorText,errorCode){
      this.$refs.footer.init(9,0)
      this.progress.go('readingTimeSmallQuestion')
      this.errorLog(errorText,errorCode)
    },
    // 播放 情景对话
    playSituationalDialogue(step,time){
      this.questionIdx=0;
      this.dialogIdx++;
      const chap=this.question.subContents[this.questionIdx].options[this.dialogIdx]
      if(chap){
        // 播放机器语音
        if(chap.roleType==2){
          Bus.h5Audio.play({
            url:chap.listenFileUrl,
          })
          this.$refs.footer.init(3,chap.listenSeconds)
          this.progress.waitSecondAndGo(chap.listenSeconds,'playSituationalDialogue')
        }else if(chap.roleType==1){// 开始录音
          this.progress.next()
        }
      }else{
        this.progress.go('nextQuestion')
      }

    },
    // 小题准备时间 情景对话
    readingTimeRecordDialogue(){
      this.$refs.footer.init(4,5)
      this.progress.waitSecondAndGo(5)
    },
    // 开始录音，录音倒计时 情景对话
    startRecordDialogue(){
      Bus.countdown.show(0)
      const chap=this.question.subContents[this.questionIdx].options[this.dialogIdx]
      this.$refs.footer.init(8,chap.recordSeconds)

      this.GUID=Bus.GUID()
      //根据二级题型来确定打分字符串和打分模式
      startRecord(this.GUID,chap.jsgf,'A', (result)=> {
        this.successDialogue(result)
      }, (errorText,errorCode)=>{
        this.error(errorText,errorCode)
      })
      this.progress.waitSecondAndGo(chap.recordSeconds)
    },
    //录音成功 情景对话
    successDialogue(result){
      this.result.push(result);
      this.$refs.footer.init(7,0)
      this.progress.go('playSituationalDialogue')

    },
    //录音失败 情景对话
    errorDialogue(errorText,errorCode){
      this.$refs.footer.init(9,0)
      this.progress.go('readingTimeRecordDialogue')
      this.errorLog(errorText,errorCode)
    },
    // 录音失败的错误
    errorLog(){

    },
    // 暂停
    pause(){
      this.progress.pause()
      Bus.$emit('pause',true)
      this.questionPlaying=false;
      Bus.h5Audio.pause()
    },
    // 继续播放
    repause(){
      this.progress.repause()
      Bus.$emit('pause',false)
      Bus.h5Audio.repause()
      if(this.progress.curStep==''){
        this.questionPlaying=true;
      }

    },
    //下一道题
    nextQuestion:function(){
      Bus.$emit('nextQuestion',this)
    },
    //下一步状态
    next(){
      this.progress.next()
    },
  },
  destroyed(){
    this.progress.destroyed();
  }
}
