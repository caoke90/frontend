<template v-if="status==='loaded'">
  <div>
    <div class="container" :key="keyNum">
        <div class="setBar" v-if="isShowSet">
            <div @click="openSetreadnum" class="linklist" v-if="(pageData.followup_num!='' && pageData.followup_num)&&isShowReadnum">
                <p>跟读次数<span class="text" v-bind:class="{textActive:isSet}" v-html="numText" :key="numText"></span><span class="arrow"></span></p>
            </div>
            <div class="linklist"
                 @click="openReadmode"
                 v-if="pageData.oral_questions.length!=0 && pageData.speak_mode!=0"><p>口语作答模式<span class="text">
                  {{pageData.speak_mode==1 &&pageData.speak_mode!=0 ?'考试模式':'练习模式'}}</span><span class="arrow"></span></p>
            </div>
        </div>
      <template v-if="status==='loaded'">
        <div class="box" v-for="(block,bk) in pageData.blocks" :key="bk" v-show="block.quesArr.length!==0">
          <div class="title" >{{block.name}}</div>
          <div class="card" v-for="(v,k) in block.quesArr" :key="k" v-show="v.selected">
            <question  :question="v" v-if="v" ></question>
            <div class="line" :class='{lastLine:k === block.quesArr.length-1}' ></div>
          </div>
        </div>
        <template v-if="pageData.blocks.length===0|| ( pageData.blocks.length === 1 && pageData.blocks[0].quesArr.length === 0 )">
          <msg style="height: 5rem;" :card="{type:'empty'}"></msg>
        </template>
      </template>
      <template v-else-if="status==='error'">
        <msg style="height: 5rem;" :card="{type:'error'}"></msg>
      </template>
    </div>
  </div>
</template>

<script>
  import Question from '../models/question/Question';
  import ajax from '../api/ajax';
  import qs from 'qs';
  import Bus from '../marvel/bus';
  import Cart from '../api/cart';

  import {getOrderBy2Id} from '../api/order.js';
  import {getInitParams} from '../common/js/external/index';
  import {platform} from '../common/js/utils/index';
  import {sendLog} from '../common/js/logger';
  import {forwardPage,newbieGuide} from  '../common/js/external/teacher'
  //网络异常
  import msg from '../components/cards/msg.vue';

  document.body.addEventListener('touchstart', function () { }); //为模拟h5 :active样式
  export default {
    data() {
      return {
        status:'loading',
        index:0,
        keyNum:0,
        readNum:'',
        numText:'',
        isSet:false,
        isShowSet:true,
        isShowReadnum:true,
        isShowbox:true,
        pageData: {
          duration:0,
          quesArrLen:'',
          question_count:0,
          followup_num:null,
          speak_mode:null,
          oral_questions:[],
          blocks:[],
          catalog_id: ''
        },
        questions:[],
        isloaded: false,
      }
    },
    components: {
      msg,
    },
      watch: {
          'pageData': {
              handler: function(val, oldVal){  //移除题目监听口语&跟读题题量 实时隐藏/显示设置入口
                  oldVal.blocks.forEach((blocks, index)=>{
                      blocks.quesArr.forEach((item, i)=>{
                          if(!item.selected){
                              blocks.quesArr.splice(i,1);
                              for(let k in this.pageData.followup_num){
                                  if(item.newContentSubtypeId==k){
                                      this.pageData.followup_num[k].question_num--
                                      if(  this.pageData.followup_num[k].question_num==0){
                                          delete this.pageData.followup_num[k]
                                      }
                                  }
                              }
                              this.isShowReadnum = JSON.stringify(this.pageData.followup_num)=='{}' ? false :true
                              if(this.pageData.oral_questions[i]===item.id){
                                  this.pageData.oral_questions.splice(i,1)
                              }
                          }
                      });
                  });
              },
              deep: true
          }
      },

      methods: {
        //更新购题车
        refreshCart: async function (refresh) {
            if(refresh){
                await Cart.refresh();
            }
        },
      //题目 数据格式
      formatQuesData: function (question,category) {
        // 拼接category
        question.category =  Object.assign({},category,{
          catalog_id: this.catalog_id || ""
        });
        const ques = new Question(question);

        ques.selected = Cart.hasQuestion(ques);
        if (question.newContentSubtypeId) {
          let item = getOrderBy2Id(question.newContentSubtypeId);
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
      // 刷新页面
      init: function (pageData) {
        let cat={},questionIDList = [];
        for(let id in pageData.questions){
          const item=pageData.questions[id];
          const ques =this.formatQuesData(item,this.getCat(item.id,pageData.blocks));
          const readCount=1;
          if(!cat[ques.cname]){
            cat[ques.cname]={
              name:ques.cname,
              forderId:ques.forderId,
              readCount:readCount,
              quesArr:[]
            }
          }
          cat[ques.cname].quesArr.push(ques)
        }
        let quesList=[];
        for(let k in cat){
            quesList.push(cat[k]);
        }
         this.pageData.blocks=quesList;
        // 分类排序
        this.pageData.blocks.sort(function (item1,item2) {
          return item1.forderId>item2.forderId?1:-1
        });
        this.pageData.blocks[0].quesArr.forEach((ques) => {
          questionIDList.push(ques.id)
        });

        this.pageData.duration=pageData.duration;
        this.pageData.question_count=pageData.question_count;
        this.pageData.followup_num=pageData.followup_num;
        this.pageData.speak_mode=pageData.speak_mode;
        this.pageData.oral_questions=pageData.oral_questions;
        let numArr=[];
        for(let k in this.pageData.followup_num){
            numArr.push(this.pageData.followup_num[k].num)
        }
          let totalNum=0;
        numArr.forEach((item,index) =>{
            totalNum+=numArr[index];
            if(totalNum==(numArr[index]*numArr.length)){
                if(item==1){
                    this.isSet=false;
                    this.numText="1次&nbsp&nbsp(默认)"
                }else{
                    this.isSet=true;
                    this.numText=item+"次"
                }
            }else{
                this.isSet=true;
                this.numText="已设置"
            }
        });
        sendLog('','',{event:'onlineEn_Assignment_HomeworkView',logData:{platformType:'H5',questionNum:this.pageData.question_count,questionIDList:questionIDList,expectTime:Math.ceil(this.pageData.duration/60)}})
      },
      refreshData:async function () {
        const [resp]=await ajax.all([
          ajax.post('/cart/preview'),
          Cart.getCardInfo()
        ]);
        this.isloaded = true;
        if (resp.data.message == 'ok') {
          Bus.$emit('loading',false);
          this.init(resp.data.data);
          this.status='loaded';

        }else{
          this.status='error';
        }
      },
      //原生跳转webview
      openPackage:function(data){
          if (window.external && window.external.forwardPage) {
              forwardPage(data);
          } else {
              let uri =data.url+'?'+qs.stringify(data.params);
              window.open(uri,"_blank");
          }
      },
      //跟读次数设置跳转
      openSetreadnum:function () {
          let data = {
              url:window.location.origin+"/mteacher/setReadNum.html",
              type:'setReadNum',
              title:'跟读次数设置',
              needCart:false
          };
          sendLog('','',{event:'onlineEn_SpeakAndRead_setModelEntry',logData:{modelType:'跟读次数'}});
          this.openPackage(data)
      },
      //口语作答模式设置跳转
      openReadmode:function(){
          let data = {
              url:window.location.origin+"/mteacher/readMode.html",
              type:'readMode',
              title:'口语作答模式设置',
              params:{
                  speaking_mode:this.pageData.speak_mode
              },
              needCart:false
          };
          sendLog('','',{event:'onlineEn_SpeakAndRead_setModelEntry',logData:{modelType:'口语作答模式'}})
          this.openPackage(data);
      }
    },
  mounted (){
        //页面渲染完成
      if (window.external && window.external.onFinishRender) {
          window.external.onFinishRender();
      }
  },
    created: async function () {
       let params = getInitParams();
       this.catalog_id = params.catalog_id;
       await this.refreshData();
       // 设置跟读&口语作答模式兼容ios老版本
        const version =initParams.native_version;
        const re = new RegExp( /^[2-9]+\.[4-9]+(\.[0-9])*/);
        if(!re.test(version) && platform() ==='ios'){
            this.isShowSet=false;
        }

        // 新手引导原生交互
        if(window.external && window.external.newbie_guide){
            let data={
                guide_type:''
            };
            if(this.pageData.speak_mode!=0 && this.pageData.followup_num!=''){
                data.guide_type="guide_followRead_and_speaking"
            }else if(this.pageData.speak_mode==0 && this.pageData.followup_num!=''){
                data. guide_type="guide_followRead"
            }else if(this.pageData.speak_mode!=0  && this.pageData.followup_num==''){
                data.guide_type="guide_speaking"
            }
            newbieGuide(data)
        }
        Bus.$on('refreshCart', async ()=> {
            Bus.$emit('loading',true);
            await this.refreshData();
            await  this.refreshCart(true);
            this.keyNum++
        });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .container {
    max-width: 750px;
    margin: 0 auto;
    font-size: 0.28rem;
    padding-bottom: 0.42rem;
      .setBar{
          background: #FFFFFF;
          overflow:hidden;

          .linklist{
              height: 1rem;
              line-height: 1rem;
              color: #171717;
              font-size: 0.3rem;
              position:relative;
              -webkit-user-select:none;
              -moz-user-select:none;
              user-select:none;
              &:active{
                    background: #e6e6e6;
               }
               p{
                   margin: 0 0.4rem;
                   padding-right: 0.4rem;
                   position:relative;
                  &:after{
                       content: '';
                       height: 0.02rem;
                       background: #E5E5E5;
                       width: 7.5rem;
                       position: absolute;
                       left: 0;
                       bottom: 0;
                       transform:scaleY(.5);
                   }
               }
              &:last-child{
                    p{
                      &:after{
                           height: 0;
                       }
                    }
              }
          .text{
              position: absolute;
              height: 100%;
              right: 0.32rem;
              top: 0;
              color: #58595E;
              font-size: 0.28rem;
          }
          .textActive{
              color: #007AFF;
          }
          .arrow{
              width: 0.24rem;
              height:100%;
              position: absolute;
              right: 0.4rem;
              top: 0;
              background: url('../assets/img/upArrow.png') no-repeat;
              background-size: contain;
              transform: rotate(90deg);
          }

          }
      }
  }

  .box {
    background: #fff;

    .title {
      line-height: 0.56rem;
      padding-left: 0.4rem;
      height: 0.56rem;
      background:#f5f6f7;
      font-size: 0.28rem;
      color: #58595e;
    }
    .card {
      .line {
        height: 0.2rem;
        background: #f5f6f7;
        width: 100%;
      }
      .lastLine{
        height: 0rem;
      }
    }
  }

  .foot {
    position: fixed;
    bottom: 0;
    width: 7.5rem;
    padding: 0.2rem 0.4rem;
    .bg {
      position: absolute;
      z-index: 0;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      opacity: 0.95;
      background: #FFFFFF;
      box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, 0.10);
    }
    .mes {
      position: relative;
      z-index: 1;
      color: #58595E;
      text-align: center;
      margin-bottom: 0.2rem;
    }
    .btn {
      position: relative;
      z-index: 1;
      background: #007AFF;
      border-radius: 100px;
      max-width: 6.7rem;
      height: 1rem;
      text-align: center;
      color: #fff;
      font-size: 0.32rem;
      line-height: 1rem;
      margin: 0 auto;
    }
  }

</style>
