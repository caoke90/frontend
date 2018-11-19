/*
* 流程控制器
* 作者：caoke
* */
class Step{
  //初始化
  constructor(stepArr,callback){

    this.stepArr=stepArr;
    this.curIndex=0;
    this.isPaused=false;
    this.nextStep='';
    this.curStep=this.stepArr[this.curIndex];
    this.hasRunTimes={};
    this.stepArr.forEach( (step)=> {
      this.hasRunTimes[step]=0;
    })
    this.callback=callback;
  }
  callback(){
    this.go()
  }
  // 运行当前流程
  run(){
    if(this.timer){
      clearTimeout(this.timer);
      this.timer=null;
    }
    this.curStep=this.stepArr[this.curIndex]
    if(this.curStep){
      this.hasRunTimes[this.curStep]++
      this.callback&&this.callback.apply(this,[this.curStep,this.hasRunTimes[this.curStep]])
    }
  }
  // 跳转到某个流程
  go(step){
    if(step){
      this.curIndex=this.stepArr.indexOf(step)
    }else{
      this.curIndex++
    }
    this.run()
  }
  // 进入下一个流程
  next(){
    if(this.nextStep){
      const step=this.nextStep;
      this.nextStep='';
      this.go(step)
    }else{
      this.go()
    }
  }
  // 自动进入下一步
  waitSecondAndGo(second,step){
    this.nextStep=step;
    this.startTime=new Date().getTime();
    this.allSecond=second;
    this.leftSecond=second;
    clearTimeout(this.timer);
    const curIndex=this.curIndex
    this.timer=setTimeout(() => {
      this.nextStep='';
      if(curIndex==this.curIndex){
        this.go(step)
      }
    },(second||0)*1000)
  }
  // 暂停
  pause(){
    if(!this.isPaused){
      this.isPaused=true;
      clearTimeout(this.timer);
      const duration=parseInt((new Date().getTime()-this.startTime)/1000);
      this.leftSecond=this.leftSecond-duration;
    }
    console.log(this.leftSecond)
  }
  // 继续
  repause(){
    if(this.isPaused){
      this.isPaused=false;
      clearTimeout(this.timer);
      const curIndex=this.curIndex
      this.startTime=new Date().getTime();
      this.timer=setTimeout(() => {
        this.nextStep='';
        if(curIndex==this.curIndex){
          this.go(this.nextStep)
        }
      },(this.leftSecond||0)*1000)
    }

  }
  // 销毁
  destroyed(){
    if(this.timer){
      clearTimeout(this.timer);
      this.timer=null;
    }

  }
}
export default Step;
