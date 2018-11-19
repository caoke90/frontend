<!--
    @action: 项目中通用的倒计时弹出框
 -->


<template>
  <div class="countdown"
       v-if="isshow">
    <div class="count-ct">{{txt}}&nbsp;<em>{{num}}s</em></div>
  </div>
</template>

<script>
  import Bus from '../../../marvel/bus.js';                                                         // Bus 通信组件

  export default {
    'name': 'countdown',
    data () {
      return {
        countTimer: null,                                                                                     // 倒计时 setInterval 的函数引用
        isshow: false,                                                                                   // 控制组件显示的参数
        num: 0,                                                                                                 // 倒计时的数字
        txt: '开始录音'                                                                                        // 倒计时展示的文本
      }
    },
    'methods': {
      show(secend,callback){
        if(secend){
          this.isshow=true;
          this.num=secend;
          clearInterval(this.countTimer);
          this.countTimer = setInterval( () =>{
            if (--this.num <= 0) {
              this.isshow = false;
              clearInterval(this.countTimer);
              this.countTimer = null;
              if (callback) {
                callback();
              }
            }
          }, 1000);
        }else{
          this.isshow=false;
        }

      },
    },
    created () {
      Bus.countdown=this;
    }
  }
</script>
<style lang="scss" scoped>

  .countdown {
    position: absolute;
    height: calc(100% - 53px);
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, .3);
    .count-ct {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 24.5px;
      height: 75px;
      width: 200px;
      // text-align: center;
      font-size: 17px;
      color: #444444;
      line-height: 75px;
      background: #FFFFFF;
      box-shadow: 0 1px 7px 0 rgba(199,199,199,0.60);
      border-radius: 10px;
      padding-left: 64.5px;
      box-sizing: border-box;
      em {
        position: relative;
        // display: inline-block;
        // vertical-align: middle;
        height: 36px;
        width: 28px;
        top: 2px;
        line-height: 18px;
        font-size: 25px;
        color: #6DC898;
        text-align: center;
        margin-left: 2px;
      }
    }
    .count-ct:before {
      position: absolute;
      content: '';
      height: 29px;
      width: 22px;
      background: url(../../../assets/questions/hourglass.png) no-repeat;
      background-size: cover;
      top: 22px;
      left: 32.5px;
    }
  }

</style>
