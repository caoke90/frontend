<template>
  <div >
    <m-header></m-header>
    <div class="m-main" style="padding-top: 15px; min-height: calc(100vh - 260px);">
      <m-crumb :pageInfo="navList"></m-crumb>
      <div class="preview">
        <div class="title">英语练习</div>
        <div class="info">
          <div class="box" v-for="(block,bk) in pageData.blocks" :key="bk" v-show="block.quesArr.length!==0">
            <div class="ptitle" v-if="block.quesArr.length">{{block.name}}</div>
            <div class="card" v-for="(v,k) in block.quesArr" v-show='v.selected' :key="k">
              <question :question="v" v-if="v"></question>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 30px;" ref="cartviewbox">
      <div  ref="cartview" class="fixed">
        <cartview style="width: 1000px;margin: 0 auto;"></cartview>
      </div>
    </div>
    <m-footer></m-footer>
    <confirm></confirm>
    <buzhi></buzhi>
  </div>
</template>

<script>
  import Question from '@/models/question/Question';
  import ajax from '@/api/ajax.js'
  import Cart from '@/api/cart.js'
  import Bus from '@/marvel/bus.js'
  import {getOrderBy2Id} from '@/api/order.js'
  import sa from '@/utils/sensorsdata'

  export default {
    name: 'preview',
    components:{
      'm-header':require('./common/mheader.vue'),
      'm-crumb':require('./common/crumb.vue'),
      'm-footer':require('./common/mfooter.vue'),
      'cartview':require('./preview/cartview.vue'),
      'confirm':require('./common/confirm.vue'),
      'buzhi':require('./common/buzhi.vue'),
    },
    data () {
      return {
        isLoading:false,
        isShow:true,
        pageData: {
          duration:0,
          question_count:0,
          blocks:[],
          catalog_id: ''
        },
        questions:[],
        navList:[{name:"首页",selectd:true,url:window.zxbaseURL+"/"},{name:"教材同步",selectd:true,url:(process.env.STAGE=='production' ? '/s17' : '') + "/pcteacher/assign.html?tab=sync"},{name:"预览",selectd:false}]
      }
    },
    methods:{
      goback:function(){
        window.history.back();
      },
      init:async function () {
        this.isLoading=true
        const [resp]=await ajax.all([
          ajax.post('/pc/v1/cart/preview'),
          Cart.getCardInfo()
        ]);
        this.isLoading=false
        this.setPageData(resp.data.data)
      },
      //题目 数据格式
      formatQuesData: function (question,category) {
        // 拼接category
        question.category =  Object.assign({},category,{
          catalog_id: this.catalog_id || ""
        });
        const ques = new Question(question);
        ques.selected = Cart.hasQuestion(ques);

        if (question.new_content_subtype_id) {
          let item = getOrderBy2Id(question.new_content_subtype_id);
          ques.cname=item[2];
          ques.forderId=item[0];
        }
        else {
          ques.cname='其他';
          ques.forderId=1000;
        }
        this.questions.push(ques)
        return ques;
      },
      // 获取题目对应的category
      getCat:function(id,blocks){
        for(let k in blocks){
          const block=blocks[k];
          for(let k2 in block.items){
            if(block.items[k2].id===id){
              return block.category;
            }
          }
        }
      },
      setPageData: function (pageData) {
        let cat={};
        for(let id in pageData.questions){
          const item=pageData.questions[id];
          const ques =this.formatQuesData(item,this.getCat(item.id,pageData.blocks));
          if(!cat[ques.cname]){
            cat[ques.cname]={
              name:ques.cname,
              forderId:ques.forderId,
              quesArr:[ques]
            }
          }else{
            cat[ques.cname].quesArr.push(ques)
          }
        }
        for(let k in cat){
          this.pageData.blocks.push(cat[k])
        }
        // 分类排序
        this.pageData.blocks.sort(function (item1,item2) {
          return item1.forderId>item2.forderId?1:-1
        })
        this.pageData.duration=pageData.duration
        this.pageData.question_count=pageData.question_count
        // console.log(this.pageData.blocks);
      },
      refreshCart: async function () {
        let isGoBack = false
        this.questions.forEach((item)=>{
          if(Cart.hasQuestion(item)){
            isGoBack = true
          }
          item.selected = Cart.hasQuestion(item)
        })
        if(!isGoBack){
          this.goback()
        }
      },
    },
    created:function () {
      Bus.preview = this;
    },
    mounted:async function () {
      window.currentScene = '作业预览'
      await this.init()
      Bus.$on('updateCart',  ()=> {
        this.refreshCart()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @import '../assets/css/assign.css';
</style>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .fixed{
    position: fixed;
    left: 0;
    bottom:0;
    width: 100%;
    z-index: 999;
  }
  .preview{
    background: #FFFFFF;
    border: 1px solid #DBE6EE;
    position: relative;

    .title{
      background: #FAFBFC;
      border-bottom: 1px solid #DBE6EE;
      height: 60px;
      text-align: center;
      line-height: 60px;
      font-size: 20px;
      color: #555555;
      font-family: PingFangSC-Regular;
    }
    .info{
      padding: 0 20px;

      .ptitle{
        font-family: MicrosoftYaHei;
        font-size: 16px;
        line-height: 21px;
        color: #555555;
        position: relative;
        padding: 20px 0 14px 11px;
        &:before{
          content:'';
          width: 4px;
          height: 14px;
          position: absolute;
          background: #159CFC;
          left: 0;
          top: 25px;
          display: block;
        }
      }
      .card{
        background: #FFFFFF;
        margin-bottom: 10px;
      }
    }
  }

</style>
