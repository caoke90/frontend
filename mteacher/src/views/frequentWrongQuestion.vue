<template>
  <div class="container" id="container" v-if="status!=='loading'">
    <div class="box" v-if="questionsCount" style="height:1.17rem;">
      <div class="card23 line" style="position: fixed;z-index:1;width: 100%;">
        共 {{ questionsCount }} 大题，预计 {{ finishedTime }} 分钟
        <div class="btn remove" v-if="isselect" @click="toggle">全部移除</div>
        <div class="btn" v-else @click="toggle">全部选入</div>
      </div>
      <div style="height: 0.2rem;background: #f5f6f7;"></div>
    </div>
    <template v-if="status==='loaded'">
      <scroller :data="card_group" @loadmore="next">
        <div class="box" slot-scope="props">
          <question  :question='props.item' :qindex="props.index" :bagtype="pageType"></question>
        </div>
      </scroller>
      <template v-if="card_group.length===0">
        <msg style="height: 5rem;" :card="{type:'empty'}"></msg>
      </template>
      <div v-if="buzy" class="weui-loadmore">
        <i class="weui-loading"></i>
        <span class="weui-loadmore__tips">正在加载更多…</span>
      </div>
      <div v-if="!buzy&&end" class="weui-loadmore weui-loadmore_line">
        <span class="weui-loadmore__tips">没有更多了</span>
      </div>
    </template>
    <template v-else-if="status==='error'">
      <msg style="height: 5rem;" :card="{type:'error'}"></msg>
    </template>
  </div>
</template>
<script>

  import Bus from '../marvel/bus';
  import log from '../common/js/utils/logConfig';
  import {sendLog} from '../common/js/logger';

  // 网络异常提示信息组件
  import msg from '../components/cards/msg.vue';
  import scroller from "../marvel/scroller";

  // 购物车和网络请求已经题目
  import Cart from '../api/cart';
  import ajax from '../api/ajax';
  import Question from '../models/question/Question';

  // 通过路径获取对象属性值
  import {getInitParams,setTopBarInfo,updateTitle} from '../common/js/external/index';
  import qs from 'qs';

  export default {
    data() {
      return {
        status:'loading',
        card_group:[],
        buzy:false,
        end:false,
        catalog_id: '',
        bagparams:null
      }
    },
    components: {
      msg,
      scroller,
    },
    computed: {
      // 题目数量
      questionsCount: function(){
        return this.card_group.length;
      },

      // 题目全部完成时间
      finishedTime: function(){
        let time = 0;

        if (this.card_group.length >0) {
          this.card_group.forEach(function(card){
            time += card.seconds  || 0;
          });
        }
        return Math.ceil(time/60);
      },

      // 全选
      isselect: function () {
        if (this.card_group.length >0) {
          return  this.card_group.every(function(card) {
            return card.selected;
          });
        }
      }
    },

    methods: {
      toggle: function () {
        if (!this.card_group.length){return;}
        let isall = this.isselect;
        for (let i = 0; i < this.card_group.length; i++) {
          if (!isall) {
            this.card_group[i].selected = true;
          } else {
            this.card_group[i].selected = false;
          }
        }
        if (isall) {
          Bus.$emit('Cart',{
            type:'remove_questions',
            ques:this.card_group
          })
        } else{
          // 全选打点
          sendLog(log.module.m_frequent,log.op.frequent_all_question_select,{s0:'english'});
          Bus.$emit('Cart',{
            type:'add_questions',
            ques:this.card_group
          })
        }
      },

      next:async function(){
        console.log("加载更多数据");
        if(!this.buzy&&!this.end){
          this.buzy = true;
          this.bagparams.page+=1;
          await this.loadmore();
          this.buzy = false;
        }
      },

      loadmore: async function () {

        //初始化请求页面数据
        let resp = await ajax.post('/assign/lessonWrongContent',this.formatData(this.bagparams));

        if(resp.data.message==='ok'&&this.buzy===true) {
          const pageData = resp.data.data;
          const card_group = [];

          pageData.question_boxs.forEach((question) => {
            card_group.push(this.formatQuesData(question, pageData.category));
          });
          this.card_group =this.card_group.concat(card_group);

          if(resp.data.data.page_info.now_page==resp.data.data.page_info.total_page){
            this.end = true;
          }
        }
      },

      // 题目 数据格式
      formatQuesData: function (question,category) {
        // 拼接category
        question.category =  Object.assign({},category,{
          catalog_id: this.catalog_id || ""
        });
        const ques = new Question(question);
        ques.selected = Cart.hasQuestion(ques);
        return ques;
      },

      // 参数 格式
      formatData:function (params) {
        const data={};
        for (let k in params) {
          if (typeof params[k] == 'object') {
            data[k] = JSON.stringify(params[k]);
          }
          else {
            data[k]=params[k];
          }
        }

        return data;
      },

      has:function(question,card_group){
        let has = -1;
        for (let i =0;i<card_group.length;i++) {
          if (question.id === card_group[i].id){
            has= i;
            break;
          }
        }
        return has;
      },

      refreshCart: async function (refresh) {
        if(refresh){
          await Cart.refresh();
        }
        this.card_group.forEach((item)=>{
          item.selected =  Cart.hasQuestion(item);
        });
      },

      refreshData: async function () {
        this.buzy = false;
        //初始化请求页面数据

        const [resp] = await ajax.all([
          ajax.post('/assign/lessonWrongContent',this.formatData(this.bagparams)),
          Cart.getCardInfo()
        ]);

        if(resp.data.message === 'ok') {
          this.end = false;
          const pageData = resp.data.data;
          const card_group = [];

          pageData.question_boxs.forEach((question) => {
            if(this.has(question,card_group) === -1){
              card_group.push(this.formatQuesData(question, pageData.category));
            }

          });
          this.card_group = card_group;

          if(resp.data.data.page_info.now_page==resp.data.data.page_info.total_page){
            this.end = true;
          }
          this.status = 'loaded'
        } else {
          this.status = 'error'
        }
      },

      // 设置跳转题库
      setQuestionPage: function (params) {
        let url = window.location.origin+"/mteacher/tcques.html?"+qs.stringify(params);
        setTopBarInfo({
          show: true,
          rightText: "题库",
          rightTextColor: "212121",
          nextAction: url,
          needCart: true
        });
      }
    },
    created: async function () {
      const vm = this;
      // 获取准备参数
      let params = getInitParams();
      vm.catalog_id = params.catalog_id;
      updateTitle(params.package_name,'','');

      this.bagparams = {
        group_id: params.group_id,
        date: params.date,
        bkc_id: params.bkc_id,
        package_name: params.package_name,
        package_type: params.package_type,
        page: 1,
        page_size: 10
      };

      this.pageType = this.$root.pageType;

      // 设置跳转到题库页面
      let quesParams = {
        bkc_id: params.bkc_id,
        bk_id:  params.bk_id,
        class_level: params.extraParams?params.extraParams.class_level:params.class_level,
        unit_id:  params.extraParams?params.extraParams.unit_id:params.unit_id,
        form: 'frequentwronglist'
      };

      vm.setQuestionPage(quesParams);
      await this.refreshData();

      Bus.$on('refreshCart',  ()=> {
        this.refreshCart(true);
      });

      Bus.$on('updateCart',  ()=> {
        this.refreshCart(false);
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
    -webkit-overflow-scrolling: touch;
    min-height: 100vh;
  }
  .box {
    margin-bottom: 0.2rem;
  }
  .line{
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
  .card23 {
    background: #FFFFFF;
    padding: 0.3rem 0.4rem;
    position: relative;
    font-size: 0.28rem;
    -webkit-overflow-scrolling: touch;

    .btn {
      position: absolute;
      top: 0.22rem;
      right: 0.32rem;
      background: rgba(0, 122, 255, 0.05);
      border: 0.02rem solid #007AFF;
      border-radius: 2rem;
      padding: 0 0.26rem;
      font-size: 0.28rem;
      color: #007AFF;
      text-align: center;
      line-height: 0.52rem;
      cursor: pointer;
    }
    .btn.remove {
      background: #007AFF;
      border-radius: 2rem;
      color: #fff;
    }
  }
</style>



