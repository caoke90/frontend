<template>
  <div class="msg">
    <div class="card">
      <div class="error" v-if="card.type=='error'">
        <div class="img"></div>
        <div class="text">{{card.msg||'数据加载失败'}}</div>
        <div class="btn" @click="reload">点击重试</div>
      </div>
      <div class="empty" v-else-if="card.type=='empty'">
        <div  v-if='!card.noshowimg' class="img"></div>
        <div class="text">{{card.msg||'暂无满足条件的题目'}}</div>
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
    font-size: 0.28rem;
    .card {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 1.7rem;
    }
    .error {

      text-align: center;
      .img {
        width: 1.84rem;
        height: 1.58rem;
        background: url("../../assets/img/msg/error.png") no-repeat;
        background-size: 100%;
        margin-bottom: 0.19rem;
        display: inline-block;
      }
      .text {
        color: #9D9FA1;
        margin-bottom: 0.2rem;
        white-space: nowrap;
      }
      .btn {
        background: #F5F6F8;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 1rem;
        width: 2.4rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        display: inline-block;
        color: #AAAAAA;
      }
    }
    .empty {

      text-align: center;
      .img {
        width: 1.7rem;
        height: 1.5rem;
        background: url("../../assets/img/msg/empty.png") no-repeat;
        background-size: 100%;
        margin-bottom: 0.3rem;
        display: inline-block;
      }
      .text {
        color: #9D9FA1;
        margin-bottom: 0.2rem;
        white-space: nowrap;
      }
    }
  }
</style>
