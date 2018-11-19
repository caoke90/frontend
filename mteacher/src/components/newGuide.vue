<template>
  <div class="guide-wrap">
    <!--遮罩层-->
    <div class="shadow" v-if="isshow" @touchmove.prevent></div>
    <!--1、只显示跟读次数-->
    <template v-if="type==='gendu'">
      <div v-if="isshow">
        <img src="../assets/img/rule-gendu.png" alt="">
        <button @click="close">我知道了</button>
      </div>
    </template>
    <!--2、只显示口语作答-->
    <template v-else-if="type==='kouyu'">
      <div v-if="isshow">
        <img src="../assets/img/rule-kouyu.png" alt="">
        <button @click="close">我知道了</button>
      </div>
    </template>
    <!--3、先显示跟读次数，然后再显示口语作答-->
    <template v-else>
      <div v-if="isshow">
        <div v-if="!next">
          <img src="../assets/img/rule-gendu.png" alt="">
          <button @click="next=true">我知道了</button>
        </div>
        <div v-if="next">
          <img src="../assets/img/rule-kouyu.png" alt="" style="margin-top: 50px;">
          <button @click="close">我知道了</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: "newGuide",
    data() {
      return {
        isshow: true,
        next: false
      }
    },
    props:['type'],
    methods:{
      close: function () {
        this.isshow=false;
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="less" scoped>
  //新手引导
  .guide-wrap {
    //遮罩层
    .shadow {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      position: fixed;
      top: 0;
      left: 0;
    }
    img{
      width:600/100rem;
      position: fixed;
      top: 0;
      left: 50%;
      margin-left: -300/100rem;
    }
    button{
      width: 180/100rem;
      height: 64/100rem;
      border-radius: 100/100rem;
      border: 1px solid #fff;
      background-color: rgba(0, 0, 0, 0);
      color: #fff;
      position: fixed;
      bottom: 255/100rem;
      left: 50%;
      margin-left: -90/100rem;
      outline: none;
      font-size: 30/100rem;
    }
  }
</style>
