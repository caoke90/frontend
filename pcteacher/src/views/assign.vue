<template>
  <div style="position: absolute;width: 100%;height: 100%;">
    <m-header></m-header>
    <div class="m-main" style="padding-top: 15px; min-height: calc(100vh - 260px);">
      <m-crumb :pageInfo="pageInfo"></m-crumb>
      <m-tabbase  @tabclick="tabclick" ref="tabbase"></m-tabbase>
      <div v-show="isLoading" style="height: 400px; background-color: white; width: 100%;position: relative;">
        <img src="../assets/img/loading.gif" style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/>
      </div>
      <div v-show="!isLoading">
        <tabsync v-show="params.tab=='sync'" ref="tabsync"></tabsync>
        <tabjunior v-show="params.tab=='junior_review'" ref="tabjunior"></tabjunior>
      </div>
    </div>
    <m-footer></m-footer>
    <m-cart></m-cart>
    <confirm></confirm>
    <buzhi></buzhi>
  </div>
</template>

<script>
  import ajax from '@/api/ajax.js'
  import Cart from '@/api/cart.js'
  import Bus from '@/marvel/bus.js'
  import qs from 'qs'

  export default {
    name: 'assign',
    components:{
      'm-header':require('./common/mheader.vue'),
      'm-crumb':require('./common/crumb.vue'),
      'm-tabbase':require('./assign/tabbase.vue'),
      'tabsync':require('./tabsync.vue'),
      'tabjunior':require('./tabjunior.vue'),
      'm-footer':require('./common/mfooter.vue'),
      'm-cart':require('./common/mcart.vue'),
      'confirm':require('./common/confirm.vue'),
      'buzhi':require('./common/buzhi.vue'),
    },
    data () {
      return {
        pageInfo:[{name:"首页",selectd:true,url:window.zxbaseURL+"/"},{name:"发布练习",selectd:false}],
        zxbaseURL:window.zxbaseURL,
        isLoading:true,
        params:Object.assign({tab:'sync'},qs.parse(location.search.substr(1))),
      }
    },
    methods:{
      /*
      * 导航菜单切换
      * */
      tabclick: function(item){
        if(item.key=='sync'){
          this.params.tab='sync'
          if(history.replaceState){
            history.replaceState(null,null,location.pathname+'?'+qs.stringify(this.params))
            // 教材同步
            this.loadInit();
          }else{
            location.href=location.pathname+'?'+qs.stringify(this.params)
          }
        } else if(item.key=='junior_review'){
          this.params.tab='junior_review'
          if(history.replaceState){
            history.replaceState(null,null,location.pathname+'?'+qs.stringify(this.params))
            // 听说专区

            this.loadInit();
          }else{
            location.href=location.pathname+'?'+qs.stringify(this.params)
          }
          // this.params.tab='junior_review'
          // location.href=this.zxbaseURL+'/teacher/assign/index?'+qs.stringify(this.params);
        }else if(item.key=='entrance_exam_review'){
          this.params.tab='entrance_exam_review'
          location.href=this.zxbaseURL+'/teacher/assign/index?'+qs.stringify(this.params);
        }else if(item.key=='workbook'){
          this.params.tab='workbook'
          location.href=this.zxbaseURL+'/teacher/assign/index?'+qs.stringify(this.params);
        }else if(item.key=='classic'){
          this.params.tab='classic'
          location.href=this.zxbaseURL+'/teacher/assign/index?'+qs.stringify(this.params);
        }

      },
      loadInit:async function(){
        this.isLoading=true
        if(this.params.tab=='sync'){
          await this.$refs.tabsync.init(this.params)
        }else if(this.params.tab=='junior_review'){
          await this.$refs.tabjunior.init(this.params)
        }
        this.isLoading=false
      },
      /*
      购物车、页面初始化
      */
      init:async function () {
        await ajax.all([
          this.$refs.tabbase.init(this.params),
          Cart.getCardInfo(),
        ]);
        //页面初始化的数据
        this.loadInit()
      },

    },
    created:function () {
      Bus.assign=this;

    },
    mounted:function () {
      this.init()
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @import '../assets/css/assign.css';
  .g-bd1{overflow:hidden;margin-bottom: 30px;}
  .g-sd1{position:relative;float:left;width:202px;margin-right:-202px;}
  .g-mn1{float:right;width:100%;}
  .g-mn1c{margin-left:219px;}
</style>
