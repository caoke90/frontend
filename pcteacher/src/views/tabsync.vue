<template>
  <div>
    <m-tabcontent ref="tabcontent"></m-tabcontent>
    <div class="g-bd1" >
      <div class="g-sd1 ">
        <m-leftmenu @changePracticeType="changePracticeType" :tabs="tabs" ref="leftmenu"></m-leftmenu>
      </div>
      <div class="g-mn1">
        <div class="g-mn1c">
          <div v-show="isLoading && !isEmpty" style="height: 400px; background-color: white; width: 100%;position: relative;"><img
            src="../assets/img/loading.gif"
            style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/></div>
          <div v-show="!isLoading && !isEmpty">
            <preclass v-if="curIndex===0" ref="preclass"></preclass>
            <afterclass v-if="curIndex===1" ref="afterclass"></afterclass>
            <paperList v-if="curIndex===2" ref="paperList"></paperList>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import ajax from '@/api/ajax.js'
  import Bus from '@/marvel/bus.js'

  export default {
    name: 'tabsync',
    components:{
      msg:require('@/components/cards/msg.vue'),
      'm-tabcontent':require('./assign/tabcontent.vue'),
      'm-leftmenu':require('./assign/leftmenu.vue'),
      'preclass':require('./tabsync/preclass.vue'),
      'afterclass':require('./tabsync/afterclass.vue'),
      'paperList':require('./tabsync/paperList.vue'),
    },
    data () {
      return {
        isInit:false,
        isEmpty: false,
        clazzList:null,
        prepare:null,
        isLoading:false,
        curIndex:0,
        params:{},
        currentScene: '',
        tabs: ['课前预习', '课后复习', '单元套卷']
      }
    },
    methods:{
      init:async function () {
        if(!this.isInit){
          this.isInit=true;
          await this.$refs.tabcontent.init()
          this.changePracticeType(0)
        }
      },
      changeIsEmpty: function (){
        this.isEmpty = !this.isEmpty
      },
      // 刷新变为0
      refresh:async function(){
        await this.$refs.leftmenu.init()
        this.changePracticeType();
      },
      /*
      左边菜单切换
      课前预习、课后复习、单元套卷
      */
      changePracticeType:async function (index) {
        this.curIndex = 0
        if(index>-1){
          this.curIndex=index;
        }
        this.isLoading = true;
        Object.assign(this.params, this.$refs.tabcontent.params)
        // 请求接口
        if(this.curIndex==0){
          this.$nextTick(async ()=>{
            await this.$refs.preclass.init(Object.assign({},this.params,{page_type: 1}))
            this.isLoading = false
          })
        }
        if(this.curIndex==1){
          this.$nextTick(async ()=>{
            await this.$refs.afterclass.init(Object.assign({},this.params,{page_type: 2}))
            this.isLoading = false
          })
        }
        if(this.curIndex==2){
          this.$nextTick(async ()=>{
            await this.$refs.paperList.init(this.params)
            this.isLoading = false
          })
        }
      }
    },
    created:function () {
      Bus.tabsync = this
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

 .g-bd1{overflow:hidden;margin-bottom: 30px;}
 .g-sd1{position:relative;float:left;width:202px;margin-right:-202px;}
 .g-mn1{float:right;width:100%;}
 .g-mn1c{margin-left:219px;}
</style>
