<template>
  <modal :isshow="isshow">
    <form action="#" class="jqiform" v-if="isshow">
        <div class="jqiclose " @click="close">×</div>
        <div class="jqistates">
          <div class="jqistate" data-jqi-name="state0" style="">
            <div class="jqiarrow jqiarrowundefined" style=""></div>
            <div class="lead jqititle ">{{obj.title}}</div>
            <div class="jqimessage ">
              <div class="w-ag-center">{{obj.message}}</div></div>
            <div class="jqibuttons ">
              <button class=" jqibutton jqidefaultbutton " name="jqi_state0_button" value="true" @click="close">{{obj.okText}}</button></div>
          </div>
        </div>
    </form>
  </modal>

</template>

<script>
  import Bus from '../../marvel/bus.js'

  export default {
    name: 'confirm',
    components: {
      'modal':require('./modal.vue'),
    },
    data () {
      return {
        isshow:false,
        oriobj:{
          title:'系统提示',
          message:'加载推荐数据失败，请重试',
          okText:'知道了'
        },
        obj:null
      }
    },
    methods:{
      alert:function (obj) {
        this.isshow=true;
        this.obj=Object.assign({},this.oriobj,obj);
      },
      close:function (state) {
        this.isshow=false;
      }
    },
    created:function () {
      Bus.calert=this;
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

 /*popup - box*/
 .jqiform{width: 500px;height: 70vh}
 .jqiform .jqiclose { 
   font-size: 28px; 
   font-weight: normal; 
   color: #000; 
   border-left: 1px solid #dae6ee; 
   padding: 0; 
   height: 46px; 
   line-height: 40px; 
   width: 46px; 
   text-align: center;
   position: absolute; 
   top: 0; 
   right: 0;
    _line-height: 48px;
    overflow: hidden;
    cursor: pointer;
  }
 .jqiform .jqistates{background-color: #fff; float: none;}
 .jqiform .jqititle {  border-bottom: 1px solid #dae6ee; -webkit-border-radius: 0 0 6px 6px;color: #383a4b; padding: 13px 0 13px 20px;    line-height: 20px; font-size:18px; margin-bottom:30px;}
 .jqiform .jqimessage{ /*margin: 40px 20px 20px;*/    line-height: 20px;
   color: #444444; padding: 0;overflow: visible}
 .jqiform .jqimessage .w-ag-center{ word-break: break-all;text-align: center}
 .jqiform .jqimessage .jqicontent{ margin: 40px 20px; clear: both; line-height: 180%;}
 .jqiform .jqibuttons{ margin: 0 -7px -7px -7px;border: none; background: none; text-align: center; padding: 30px 0 30px;}
 .jqiform .jqibuttons button{margin: 0 10px; background-color: #1abc9c; color: #fff; display: inline-block; padding: 12px 35px; _padding: 12px 10px; border: 1px solid #08977b; border-radius: 4px; text-decoration: none; text-align: center; font: 14px/1.125 "å¾®è½¯é›…é»‘", "Microsoft YaHei", Arial; vertical-align: middle; outline: none; cursor: pointer;}
 .jqiform .jqibuttons button:hover{background-color: #16b495; color: #fff;}
 .jqiform .jqibuttons button:active{background-color: #10ac8d;}
 .jqiform .jqibuttons button.jqidefaultbutton{ background-color: #189cfb;color: #fff; border: 1px solid #0979ca; border-radius: 4px;}
 .jqiform .jqibuttons button.jqidefaultbutton:hover{ background-color: #52b4fb;}

</style>
