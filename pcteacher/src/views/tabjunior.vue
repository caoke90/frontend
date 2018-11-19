<template>
  <div>
    <div class="g-bd1">
      <div class="g-sd1 ">
        <m-leftmenu :tabs="tabs" @changePracticeType="changePracticeType"></m-leftmenu>
      </div>
      <div class="g-mn1">
        <div class="g-mn1c">
          <div v-show="isLoading" style="height: 400px; background-color: white; width: 100%;position: relative;"><img
            src="../assets/img/loading.gif"
            style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/></div>
            <div v-show="!isLoading">
                <m-lssPaper v-show="currentType==1" ref="zq_lsspaper" ></m-lssPaper>
                <m-lspPaper v-show="currentType==0" ref="tj_lsppaper"></m-lspPaper>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '../marvel/bus.js'
  export default {
    name: 'tabjunior',
    components:{
      'm-tabcontent':require('./assign/tabcontent.vue'),
      'm-leftmenu':require('./assign/leftmenu.vue'),
       'm-lssPaper':require('./tabjunior/lssPaper.vue'),
       'm-lspPaper':require('./tabjunior/lspPaper.vue'),
        'm-cityTem':require('./tabjunior/cityTem.vue')
    },
    data () {
      return {
        isInit:false,
        isLoading:false,
        clazzList:null,
        currentType:0,
        prepare:null,
        tabs:['听说套卷','听说专项'],
      }
    },
    methods:{
      init:async function () {
        if(!this.isInit){
          this.isInit=true;
          this.changePracticeType(0)
        }
      },
    changePracticeType:async function (index) {
            this.isLoading = true;
            if(index>-1){
                    this.currentType=index;
            }
            // 请求接口
            if(this.currentType==0){
                    await this.$refs.tj_lsppaper.init();
                    this.isLoading = false;
            }
            if(this.currentType==1){
                    await this.$refs.zq_lsspaper.init();
                    this.isLoading = false;
            }

    }
    },
    created:function () {
         Bus.tabjunior=this;
    },
    mounted:function () {

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    @import '../assets/css/assign.css';
</style>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
    .g-bd1{overflow:hidden;margin-bottom: 30px; margin-top: 20px}
    .g-sd1{position:relative;float:left;width:202px;margin-right:-202px;}
    .g-mn1{float:right;width:100%;}
    .g-mn1c{margin-left:210px;}
</style>
