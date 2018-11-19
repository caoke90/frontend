<template>
  <div style="position: fixed;top:0;left: 0;width: 100%" :key="key" v-if="cartRows">
    <div class="m-main">
      <div class="questionCart h-cart">
        <div class="cart_notice" style="display: none;">
          <p>以下内容会自动拆成多份练习，每个题集为1份练习，并下发给学生</p>
          <a href="http://help.17zuoye.com/?p=1384" target="_blank">查看详情</a>
        </div>
        <div class="selected-box-fr">
          <div v-show="cartRows.question_count>0">
            <div class="content">
              <div class="sync-homework" v-for="item in cartRows.cart_detail" @click="remove_category(item.block_name)">
                <p class="title">
                  <span class="name" :title="item.block_name">{{item.block_name}}</span>
                  <span class="del"></span>
                  <span class="sum">{{item.block_value}}</span></p>
              </div>
            </div>
            <div class="pre-btns">
              <p style="font-size:12px;margin-bottom:8px">预计
                <span style="font-size:20px;color:#f86638">{{cartRows.duration_minutes}}</span>分钟完成</p>
              <a class="w-btn w-btn-green" @click="preview">预览</a>
              <a class="w-btn" @click="buzhi">发布</a>
              <a class="clean-btn" @click="removeAll">
                <span class="w-icon w-icon-17 w-icon-blue"></span>移除所有选题</a>
            </div>
          </div>
          <div class="select-tip" v-show="cartRows.question_count==0">
            从左侧列表中选题加入练习
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import Bus from '@/marvel/bus.js'
  import sa from '@/utils/sensorsdata'

  export default {
    name: 'mcart',
    data () {
      return {
        key:0,
        cartRows:null
      }
    },
    created:function () {
      Bus.mcart=this;
      // 更新购物车
      Bus.$on('updateCart', (cartRows)=> {
        this.cartRows=cartRows;
      })
    },
    methods: {
      preview:function(){
        this.sendLog()
      },
      buzhi:function(){
        Bus.buzhi.buzhi()
      },
      remove_category:function(name){
        Bus.$emit('Cart',{type:'remove_category',ques:{category:{name:name}}})
      },
      removeAll:function () {
        Bus.confirm.confirm({title:'移除所有选题',message:'确认移除所有选题吗？',cancelText:'取消操作',okText:'确认移除'},function (state) {
            if(state=='ok'){
              Bus.$emit('Cart',{type:'flush'})
            }else{

            }
        })
      },
      //神策打点
      sendLog:function(){
        let self = this
        sa.track('onlineEn_Assignment_HomeworkView', {
          questionNum: self.cartRows.question_count,
          questionID_List: self.cartRows.question_id,
          expectTime: self.cartRows.duration_minutes
        },function(){
          window.location.href = "preview.html?from=create_assignment"
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .questionCart{
    position: fixed;
    top: 35vh;
    right: 0;
    z-index: 9;
  }
  .m-main{
    position: relative;
  }
  @media screen and (min-width: 1328px){
    .questionCart{
      left: 1020px;
      position: absolute;
      right:auto;
    }
  }
  .cart_notice {
    border-top: 1px solid #dfdfdf;
    border-left: 1px solid #dfdfdf;
    border-right: 1px solid #dfdfdf;
    background-color: #e4eff7;
    font-size: 12px;
    width: 138px;
    position: relative;
    top: 1px;
  }
  .cart_notice p {
    font-size: 12px;
    font-weight: bolder;
    padding: 6px;
  }
  .cart_notice a {
    display: none;
    width: 100%;
    text-align: center;
    padding: 10px 0;
    color: #189cfb;
    background: #f4faff;
  }
  .h-cart .selected-box-fr {
    display: inline-block;
    box-sizing: border-box;
    min-height: 146px;
    border: 1px solid #dfdfdf;
    background-color: #fff;
    vertical-align: top;
    width: 140px;
  }
  .h-cart .selected-box-fr .select-tip {
    padding: 40px 10px;
    color: #9b9da4;
  }

  .h-cart .selected-box-fl {
    display: inline-block;
    box-sizing: border-box;
    width: 38px;
    margin-right: -4px;
    background-color: #667284; }

  .h-cart .selected-box-fl .fl-text {
    text-align: center;
    padding: 10px;
    color: #fff; }

  .h-cart .selected-box-fl .fl-btn {
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    box-sizing: border-box;
    width: 38px;
    height: 38px;
    background-color: #667284;
    border-top: 1px solid #5d6675; }

  .h-cart .selected-box-fl .fl-btn span {
    display: inline-block;
    width: 10px;
    height: 18px;
    background: url("/img/teacher/arrow_right.png") no-repeat;
    background-size: contain; }

  .h-cart .selected-box-fl .fl-btn span.rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg); }

  .h-cart .selected-box-fr {
    display: inline-block;
    box-sizing: border-box;
    min-height: 146px;
    border: 1px solid #dfdfdf;
    background-color: #fff;
    vertical-align: top;
    width: 140px; }

  .h-cart .selected-box-fr .select-tip {
    padding: 40px 10px;
    color: #9b9da4; }

  .h-cart .selected-box-fr .word-homework p,
  .h-cart .selected-box-fr .sync-homework p {
    position: relative;
    font-size: 12px;
    line-height: 18px;
    width: 110px;
    overflow: hidden; }

  .h-cart .selected-box-fr .sync-homework .title {
    font-weight: bold; }

  .h-cart .selected-box-fr .sync-homework .question-title {
    display: inline-block;
    width: 108px;
    font-size: 12px; }

  .h-cart .selected-box-fr .sync-homework {
    margin: 10px; }
  .h-cart .selected-box-fr .sync-homework .del {
    float: right;
    width: 16px;
    height: 16px;
    cursor: pointer;
    display: none; }

  .h-cart .selected-box-fr .name {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 72px; }

  .del {
    display: inline;
    background: url("../../assets/img/teacher/delete_normal.png") no-repeat; }

  .h-cart .selected-box-fr .sync-homework:hover {
    cursor: pointer; }
  .h-cart .selected-box-fr .sync-homework:hover .sum {
    display: none; }
  .h-cart .selected-box-fr .sync-homework:hover .del {
    display: block; }

  .h-cart .selected-box-fr .sync-homework .del:hover {
    background: url("../../assets/img/teacher/delete.png") no-repeat; }

  .h-cart .selected-box-fr .sum {
    color: #189cfb;
    float: right; }

  .h-cart .selected-box-fr .word-homework {
    padding-top: 15px; }

  .h-cart .selected-box-fr .border-bdashed {
    border-bottom: 1px dashed #eaeaea; }

  .h-cart .selected-box-fr .content {
    max-height: 200px;
    margin-bottom: 10px;
    _height: expression(this.scrollHeight>200?'200px':'auto');
    overflow: auto; }

  .h-cart .selected-box-fr .pre-btns {
    padding: 0 10px;
    padding-top: 0px; }

  .h-cart .selected-box-fr .pre-btns a {
    cursor: pointer;
    width: 120px;
    height: 40px;
    line-height: 40px;
    padding: 0;
    margin-bottom: 10px;
    font-size: 14px;
    color: #fff; }

  .h-cart .selected-box-fr .pre-btns .continue-btn {
    color: #fff;
    background-color: #d1d1d1;
    border: 1px solid #eee; }

  .h-cart .selected-box-fr .pre-btns .clean-btn {
    color: #189cfb; }

  .h-cart .selected-box-fr .tip {
    padding: 10px;
    background-color: #e9f6fc; }
  .h-cart .selected-box-fr .tip .workbook {
    position: relative;
    color: #189cfb; }
  .h-cart .selected-box-fr .tip .workbook .workbook-name {
    /*display: none;*/
    position: absolute;
    top: 0;
    left: -1000px;
    min-height: 32px;
    line-height: 32px;
    padding-left: 5px;
    background-color: #f2eaa4; }
  .h-cart .selected-box-fr .tip .workbook .workbook-name p {
    padding: 5px 0;
    color: #c66111; }
  .h-cart .selected-box-fr .tip .repeat {
    font-size: 10px; }

  .question_car_objection {
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center; }
  .question_car_objection h2 {
    display: inline-block;
    font-size: 14px; }
  .question_car_objection span {
    font-size: 14px;
    color: #189cfb; }
</style>
