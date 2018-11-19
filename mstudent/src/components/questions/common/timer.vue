<!--
    @action: 口语题和非口语题进度控制条所依赖的时间组件，显示时间进度和总时间；
-->


<template>
  <p v-if="total" class="v-ui-timer" >
    <span class='timer' :class="{'playing': titleState == '8' ,'lasttimer':((total-current) <= 5 && total >= 30 && titleState == '8')}" > {{ format(current) }}</span><span  :class="{'playing': titleState == '8'}" > / {{ format(total) }}</span>
  </p>
</template>
<script>
  import Bus from '../../../marvel/bus';
  export default {
    props: [
      'titleState'
    ],

    data(){
      return {
        current: 0,//当前时长
        total: 0,//总时长
        stopType: 'auto',//停止方式
        timeer:null
      }
    },
    created:function () {
      Bus.$on('pause', (isPaused)=> {
        if(isPaused){
          this.pause()
        }else{
          this.goon()
        }
      })
    },
    methods: {
      // 将秒数格式化为mm:ss格式
      format(num){
        let min = parseInt(num / 60);
        min = min < 10 ? '0' + min : min;
        let sec = num % 60;
        sec = sec < 10 ? '0' + sec : sec;
        return min + ':' + sec;
      },
      // 开始计时
       start(seconds){
        this.current=0;
        this.total=seconds;
        this.goon()
      },

      //暂停
      pause(){
        clearInterval(this.timeer);
      },
      //继续
      async goon(){
        clearInterval(this.timeer);
        if(this.total>0){
          this.timeer=setInterval(()=>{
            if(this.current<this.total){
              this.current++
            }else{
              clearInterval(this.timeer);
            }
          },1000);
        }
      },

    },
    destroyed(){
      Bus.$off("pause");
      clearInterval(this.timeer);
    }
  }
</script>
<style lang="scss" scoped>
  .v-ui-timer{
    display:inline-block;
    // padding-left: 5px;
    vertical-align: middle;
    font-family: DIN-Regular;
  }
  .v-ui-timer span{
    font-size: 20px;
    color: #AAAAAA;
    letter-spacing: 0;
    text-align: center;
    font-family: DIN-Regular;
  }
  .v-ui-timer span.timer{
    color: #6DC898;
  }

  .v-ui-timer span.playing{
    color: #fff;
  }

  .v-ui-timer span.playing.lasttimer{
    color: #FFFD37;
  }
</style>
