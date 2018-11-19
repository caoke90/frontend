<template>
  <div class="card"  :key="key" v-if="cartRows">
    <div class="left">
      <a href="javascript:void(0);" class="btn btn-back" @click="goback"> 返回</a>
      <a href="javascript:void(0);" class="btn btn-clear" @click="removeAll">全部移除</a>
    </div>
    <div class="right">
      <span class="text">共<span>{{cartRows.question_count}}</span>题，预计<span>{{cartRows.duration_minutes}}</span>分钟</span>
      <a href="javascript:void(0);" class="btn btn-set" @click="buzhi">提交</a>
    </div>
  </div>
</template>

<script>
  import Bus from '@/marvel/bus.js'
  import removeimg from '@/assets/img/teacher/homework-remove-warn.png'
  import sa from '@/utils/sensorsdata'
  export default {
    name: 'cartview',
    data () {
      return {
        key:0,
        cartRows:null
      }
    },
    created:function () {
      Bus.cartview=this;
      // 更新购物车
      Bus.$on('updateCart', (cartRows)=> {
        this.cartRows=cartRows;
      })
    },
    methods: {
      goback:function(){
        window.history.back();
      },
      preview:function(){
        window.location.href = "/teacher/assign/previewPaper?from=create_assignment";
      },
      buzhi:function(){
        sa.track('onlineEn_Assignment_SubmitAssignHomework', {
          questionNum: Bus.buzhi.Cart.cartRows.question_count,
          expectTime: Bus.buzhi.Cart.cartRows.duration_minutes
        },function(){
          Bus.buzhi.buzhi()
        })
      },
      remove_category:function(name){
        Bus.$emit('Cart',{type:'remove_category',ques:{category:{name:name}}})
      },
      removeAll:function () {
        let vm = this
        Bus.confirm.confirm({title:'移除所有选题',message:'<img src="'+removeimg+'"><span style="margin-left: 20px;">确认移除所有选题吗？</span>',cancelText:'取消操作',okText:'确认移除'},function (state) {
            if(state=='ok'){
              Bus.$emit('Cart',{type:'preview-remove-all'}) 
              vm.goback()
            }else{

            }
        })
      }
    },
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .card{
    background: #476685;
    height: 74px;
    line-height: 74px;
    .left{
      float: left;
    }
    .right{
      float: right;
    }
    .btn{
      width: 130px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;

    }
    .btn-back{
      background: #30BD9B;
      margin-left: 14px;
    }
    .btn-clear{
      background: #159CFC;
      margin-left: 14px;

    }
    .btn-set{
      background: #159CFC;
      margin-right: 14px;
    }
    .text{
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #FFFFFF;
      margin-right: 20px;
      span{
        font-family: PingFangSC-Medium;
        font-size: 24px;
        color: #FFFFFF;
        line-height: 22px;
      }
    }
  }
</style>
