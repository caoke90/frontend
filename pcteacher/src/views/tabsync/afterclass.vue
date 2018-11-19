<template>
  <div class="bd">
    <div v-show="isEmpty">
      <msg style="height: 400px; background: white" :card="{type:'empty'}"></msg>
    </div>
    <div v-show="!isEmpty">
      <subject @changeSubjectType="changeSubjectType"  ref='sub1'></subject>
      <div v-show="isLoading" style="height: 400px; background-color: white; width: 100%;position: relative;margin-top: 10px">
        <img src="../../assets/img/loading.gif" style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/>
      </div>
      <div class="wrap" v-show="!isLoading">
        <tcbag v-show="isTcbag" ref="tcbag"></tcbag>
        <tcques v-show="!isTcbag" ref="tcques"></tcques>
      </div>
    </div>
  </div>
</template>

<script>
  // 组件通信
  import Bus from '../../marvel/bus.js'
  // 网络请求
  import ajax from '@/api/ajax';

  export default {
    data () {
      return {
        isLoading:true,
        isEmpty: false,
        currentType: 0, // 默认课前预习类型
        subjectData: '',
        contentData: '',
        params:{
          page_type:2,
        },
        isTcbag: false,
      }
    },
    components:{
      subject:require('./subject.vue'),
      tcbag:require('./tcbag.vue'),
      tcques:require('./tcques.vue'),
      msg:require('@/components/cards/msg.vue')
    },
    methods:{
      changeSubjectType: async function (){
        await this.nextInit();
      },
      // 题包和题库的初始化
      nextInit:async function(){
        // 参数初始化
        Object.assign(this.params,this.$refs.sub1.params)
        this.isLoading=true;
        if(this.params.package_type==9){
          this.isTcbag = false
          await this.$refs.tcques.init(this.params)
        }else{
          this.isTcbag = true
          await this.$refs.tcbag.init(this.params)
        }
        this.isLoading=false;
      },
      init:async function (params) {
        await this.$refs.sub1.init(params)
        this.isEmpty = this.$refs.sub1.isEmpty
        if(this.isEmpty){
          return
        }
        this.nextInit()
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .bd{
    min-height: 200px;
  }
  .wrap{
    background: #fff;
    border: 1px solid #DBE6EE;
    margin: 10px 0 0 0;
  }
</style>
