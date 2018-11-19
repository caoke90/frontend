<template>
  <div>
    <m-header></m-header>
    <div class="m-main" style="padding-top: 15px; min-height: calc(100vh - 260px);">
      <m-crumb :pageInfo="navList"></m-crumb>
      <div class="preview">
        <div class="title">{{pageData.title}}</div>
        <div class="seleWarp">
            <div class="card23" >
                共 <span>{{ questionsCount }} </span>大题，预计 <span>{{ finishedTime }} </span>分钟
                <div class="btn remove" v-if="isselect" @click="toggle">全部移除</div>
                <div class="btn" v-else @click="toggle">全部选入</div>
            </div>
        </div>
        <div class="info" >
          <div class="box" v-for="(block,bk) in pageData.blocks" :key="bk" v-show="block.quesArr.length!==0">
            <div class="ptitle">{{numMap[bk]||(bk+1)}}、{{block.name}}</div>
            <div class="card" v-for="(v,k) in block.quesArr" :key="k">
              <question  :question="v" v-if="v"></question>
            </div>
          </div>
        </div>
        <m-cart></m-cart>
      </div>
    </div>
    <m-footer></m-footer>
    <m-cart></m-cart>
    <confirm></confirm>
    <buzhi></buzhi>
  </div>
</template>

<script>
  import Question from '../models/question/Question';
  import ajax from '../api/ajax.js'
  import Cart from '../api/cart.js'
  import Bus from '../marvel/bus.js'
  import {getOrderBy2Id} from '../api/order.js';
  import qs from 'qs';
  Bus.urlParams=Object.assign({},qs.parse(location.search.substr(1)));
  export default {
    name: 'assign',
    components:{
      'm-header':require('./common/mheader.vue'),
      'm-crumb':require('./common/crumb.vue'),
      'm-footer':require('./common/mfooter.vue'),
      'm-cart':require('./common/mcart.vue'),
      'confirm':require('./common/confirm.vue'),
      'buzhi':require('./common/buzhi.vue'),
    },
    data () {

      return {
        // get 参数
        params:Object.assign({
          paper_id:'',
          region_id:'',
          grade_id:'',
          term_id:'',
        },Bus.urlParams),

        numMap:['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'],
        pageData: {
          title:'',
          duration:0,
          question_count:0,
          blocks:[],
          catalog_id: ''
        },
        questions:[],
        navList:[{name:"首页",selectd:true,url:window.zxbaseURL+"/"},{name:"听说专区",selectd:true,url:"/pcteacher/assign.html?tab=junior_review"},{name:"套卷详情",selectd:false}]
      }
    },
      computed: {
          // 题目数量
          questionsCount: function(){
              return this.questions.length
          },
          // 题目全部完成时间
          finishedTime: function(){
              let time = 0;
              this.questions.forEach(function(card){
                  time += card.seconds  || 0;
              });
              return Math.ceil(time/60);
          },
          // 全选
          isselect: function () {
                  return   this.questions.every(function(card) {
                      return card.selected;
                  });
          }

      },
    methods:{
      //题目 数据格式
      formatQuesData: function (question,category) {
        // 拼接category
        question.category =  Object.assign({},category);
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
        this.questions.push(ques);
        return ques;
      },
       checkSelect () {
            let quesArr=[];
            for(let i=0;i<this.pageData.blocks.length;i++){
                let item=this.pageData.blocks[i].quesArr;
                for(let k=0;k<item.length;k++){
                    quesArr.push(item[k])
                }
            }
            return quesArr
        },
        refreshCart: async function () {
            this.questions.forEach((card) => {
                card.selected = Cart.hasQuestion(card);
            });
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
        for(let id in pageData.question_boxs){
          const item=pageData.question_boxs[id];
          const ques =this.formatQuesData(item,pageData.category);
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
        });
        this.pageData.title=pageData.title;
        this.pageData.duration=pageData.duration;
        this.pageData.question_count=pageData.question_count;
      },
      toggle: function () {
            if(!this.pageData.blocks.length){return;}
            let isall = this.isselect;
            let ques=[];
            for(let k=0;k<this.questions.length;k++){
                ques.push(this.questions[k])
                if(!isall){
                    this.questions[k].selected = true;
                }else{
                    this.questions[k].selected = false;
                }
            }
            if(isall){
                Bus.$emit('Cart',{
                    type:'remove_questions',
                    ques:ques
                })
            }else{
                Bus.$emit('Cart',{
                    type:'add_questions',
                    ques:ques
                })
            }
        },
      init:async function () {
        const [resp]=await ajax.all([
          ajax.post('/pc/v1/assign/listenSpeakPaperContent',this.params),
          Cart.getCardInfo()
        ]);
        this.setPageData(resp.data.data);
          Bus.$on('refreshCart', function () {
              this.refreshCart();
          }.bind(this));

          Bus.$on('updateCart', function () {
              this.refreshCart();
          }.bind(this));
      }
    },
    created:function () {
      Bus.paper = this;
    },
    mounted:function () {
      this.init()
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
 @import '../assets/css/assign.css';

</style>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
.seleWarp{
    text-align: right;
    padding: 0 20px;
    margin-top: 14px;
    .card23{
        position: relative;
        padding-right: 107px;
        font-size:14px;
        line-height: 30px;
        span{
            color: #159CFC;
            margin: 0 2px;
        }
        .btn{
            position: absolute;
            right: 0;
            top: 0;
            width: 80px;
            height: 30px;
            line-height: 30px;
            border:1px solid #159CFC;
            color: #159CFC;
            text-align: center;
            cursor: pointer;
        }
        .remove{
            background: #159CFC;
            color: #FFFFFF;
        }
    }
}
  .preview{
    background: #FFFFFF;
    border: 1px solid #DBE6EE;
    position: relative;
    padding-bottom: 20px;
    margin-bottom:60px;
    .cartview{
      width: 100%;
    }
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
        line-height: 22px;
        color: #555555;
        position: relative;
        padding: 17px 0;

      }
      .card{
        background: #FFFFFF;
        margin-bottom: 10px;
      }
    }
  }

</style>
