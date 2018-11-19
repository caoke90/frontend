<template>
  <div class="msg">
    <div class="card">
      <div class="error" v-if="card.type=='error'">
        <div class="img"></div>
        <div class="text">{{card.msg||'数据加载失败'}}</div>
        <!-- div class="btn" @click="reload">点击重试</div -->
      </div>
      <div class="empty" v-else-if="card.type=='empty'">
        <div  v-if='!card.noshowimg' class="img"></div>
        <div class="text">{{card.msg||'暂无满足条件的题目'}}</div>
      </div>
      <div class="loading" v-else-if="card.type=='loading'">
        <div class="img"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '../../marvel/bus'
  export default {
    data: function () {
      return {
        need: false,
        out: 0
      }
    },
    props: ['card'],
    name: 'msg',
    computed: {},
    methods: {
      reload: function () {
        Bus.$emit('refreshCart')
      }
    },
    mounted: function () {

    }
  };

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .msg {
    position: relative;
    font-size: 14px;
    line-height: 20px;
    .card {
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      top: 50%;
    }
    .error {
      text-align: center;
      .img {
        width: 50px;
        height: 60px;
        background: url("../../assets/img/msg/error.png") no-repeat;
        background-size: 100%;
        margin-bottom: 0.19rem;
        display: inline-block;
      }
      .text {
        color: #9D9FA1;
        margin-bottom: 5px;
      }
      .btn {
        background: #F5F6F8;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 15px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #aaa;
        cursor: pointer;
      }
    }
    .empty {

      text-align: center;
      .img {
        width:60px;
        height: 68px;
        background: url("../../assets/img/msg/empty3.png") no-repeat;
        background-size: 100%;
        margin-bottom: 0.3rem;
        display: inline-block;
      }
      .text {
        color: #9D9FA1;
        margin-bottom: 0.2rem;
      }
    }
    .loading {
      .img {
        width: 144px;
        height: 147px;
        background: url("../../assets/img/loading.gif") no-repeat;
        background-size: 100%;
        display: inline-block;
      }
    }
  }
</style>
