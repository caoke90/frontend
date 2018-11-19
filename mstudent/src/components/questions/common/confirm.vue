
<template>
<div  class="v-ui-confirm" v-show="isshow">
	<div class="confirm-warp">
	    <div class="icon"></div>
		<div class="content lfont">
      <div class="v-confirm-error ">{{text}}</div>
      <!--<div v-if="!showOralScore" class="v-confirm-time" :class="[confirmRecord.timeFont]">{{ confirmRecord.time }}</div>-->
		</div>
		<div class="v-confirm-btns">
			<!--<span  class="btn mfont left"  v-html="text" @click=""></span>-->
			<span  class="btn mfont right"  v-html="text1" @click="btnClick"></span>
		</div>
	</div>
</div>
</template>

<script>
  import Bus from '../../../marvel/bus';
/*
录完录音后的确认框
*/
export default {
	data(){
		return {
      callback:null,
      isshow:false,
      text:'录音失败，请重试',
      text1:'重录'
		}
	},
	props: {
        leftBtn: {
            type: Object
        },
        rightBtn: {
            type: Object
        },
	},
	methods: {
	  show(callback){
	    this.isshow=true;
      this.callback=callback;
    },
    btnClick(){
      this.isshow=false;
      if(this.callback){
        this.callback()
      }
		}
	},
  created(){
    Bus.confirm=this;
  }
}
</script>
<style lang="scss" scoped>
  .mfont{
    font-size: 16px;
  }
  .v-ui-confirm{
    position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1009;
    background-color: rgba(0, 0, 0, .3);
    .confirm-warp{
      position: absolute; top: 50%; left: 50%;
      width: 55%; max-width: 400px; min-width: 240px; min-height: 180px; border-radius: 10px;
      color: #090909; text-align: center;
      background-color: #FFF; transform: translate(-50%, -50%);
      .icon {
        position: absolute; width: 71px; height:63px; right: 0; left: 0; margin: -31px auto 0;
        background: url("../../../assets/questions/weep.png") no-repeat; background-size: cover;
      }
      .v-confirm-prompt{
        padding: 15px 0;
        font-weight: 500;
      }
      .content{
        // min-height: 90px;
        word-break: break-word;
        .v-confirm-error{
          padding-top: 56px;
          font-family: PingFangSC-Regular; font-size: 16px; color: #444444;  letter-spacing: 0; text-align: center;
        }
      }
      .v-confirm-btns{
        display: block;
        width: 100%; margin-top: 28px;
        text-align: center;
        .btn{
          display: inline-block;
          height: 44px; width: 180px; border-radius: 5px;
          font-weight: 500; line-height: 44px; color: #fff; vertical-align: middle;
        }
        .left{
          background: #fca028; box-shadow: 0 2px 1px 0.5px #fa940f;
        }
        .right{
          border-radius: 50px;
          color:#fff;
          background: #6DC898;
        }
      }
    }
  }

</style>
