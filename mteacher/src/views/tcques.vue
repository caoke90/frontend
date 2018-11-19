<template>
  <div class="container" id="container" v-if="status!=='loading'">
    <template v-if="status==='loaded'">
      <scroller :data="card_group" @loadmore="next">
        <div class="box" slot-scope="props">
          <question  :question='props.item' :qindex="props.index" ></question>
        </div>
      </scroller>
      <template v-if="card_group.length===0">
        <msg style="height: 5rem;" :card="{type:'empty',msg:'本地化内容生产中，敬请期待~'}"></msg>
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
  import Question from '../models/question/Question';
  //导航下拉框
  import quesBar from '../components/quesBar.vue';
  import Bus from '../marvel/bus';
  Bus.addModalComponent(quesBar);

  import ajax from '../api/ajax';
  //网络异常
  import msg from '../components/cards/msg.vue';

  import log from '../common/js/utils/logConfig';
  import {sendLog} from '../common/js/logger';

  //购物车
  import Cart from '../api/cart';
  import scroller from "../marvel/scroller";
  import {getInitParams,updateTitle} from '../common/js/external/index';


  export default {
    data() {
      return {
        status:'loading',
        allcard_group: [],
        card_group:[],
        isFilter:false,
        buzy:false,
        end:false,
        catalog_id: '',
        params:{
          bk_id:'', //教材id 是
          bkc_id:'', //课时id 是
          unit_id:'', //单元id 是
          algo_type:'', //题包类型 是
          class_level:'', //年级 是
          kps:[], //知识点 是
          content_sub_type_ids:undefined, //知识点 否
          page:1,
          page_size:10,
        }
      }
    },
    components: {
      scroller,
      msg,
    },
    methods: {
      filter:function(){
        if(!Bus.quesBar.isFilter){
          this.card_group=this.allcard_group;
        }else{
          let arr=[]
          this.allcard_group.forEach(function (question) {
            if(!question.isUsed){
              arr.push(question)
            }
          })
          this.card_group= arr;
          this.loadFilter()
        }
      },
      loadFilter:async function(){
        Bus.$emit('loading',true)
        while(this.card_group.length<10&&!this.buzy&&!this.end){
          await this.next()
        }
        Bus.$emit('loading',false)
      },
      toggle: function () {
        if(!this.card_group.length){return;}
        let isall = this.isselect;
        for (let i = 0; i < this.card_group.length; i++) {
          if (!isall) {
            this.card_group[i].selected = true;
          } else {
            this.card_group[i].selected = false;
          }
        }
        if(isall){
          Bus.$emit('Cart',{
            type:'remove_questions',
            ques:this.card_group
          })
        }else{
          Bus.$emit('Cart',{
            type:'add_questions',
            ques:this.card_group
          })
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
      has:function(question,card_group){
        let has=-1;
        for(let i =0;i<card_group.length;i++){
          if(question.id==card_group[i].id){
            has= i
            break
          }
        }
        return has;
      },

      next:async function(){
        if(!this.buzy&&!this.end){
          console.log("加载更多数据");
          this.buzy=true;
          await this.loadmore()
          this.buzy=false;
        }
      },
      loadmore:async function () {
        this.params.page+=1;
        const resp = await this.getcontent(this.params);
        if(resp.data.message=='ok'&&this.buzy==true) {
          const pageData = resp.data.data
          const allcard_group = [];

          pageData.question_boxs.forEach((question) => {
            allcard_group.push(this.formatQuesData(question, pageData.category))
          })
          this.allcard_group =this.allcard_group.concat(allcard_group);

          this.filter()

          if(resp.data.data.page_info.now_page==resp.data.data.page_info.total_page){
            this.end=true;
          }
        }
      },
      // 更新购物车
      refreshCart: async function (refresh) {
        if(refresh){
          await Cart.refresh();
        }
        this.allcard_group.forEach((item)=>{
          item.selected =  Cart.hasQuestion(item);
        });
      },
      // 请求具体的题目数据
      async getcontent({bk_id,bkc_id,unit_id,class_level,kps,content_sub_type_ids,page,page_size,algo_type}){
        const params={
          bk_id,
          bkc_id,
          unit_id,
          class_level,
          kps,
          content_sub_type_ids,
          page,
          page_size,
          algo_type,
        }
        return await ajax.post('/assign/getQuestionsFromQuestionBank',this.formatData(params));
      },
      // 格式化数组参数
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
      // 中间部分
      nextInit:async function () {
        this.params.page=1;
        this.params.algo_type=Bus.quesBar.params.algo_type;
        this.params.kps=Bus.quesBar.params.kps;
        this.params.content_sub_type_ids=Bus.quesBar.params.content_sub_type_ids;

        Bus.$emit('loading',true)
        const resp=await this.getcontent(this.params);

        if(resp.data.message=='ok') {
          this.end=false;
          const pageData = resp.data.data
          const allcard_group = [];

          pageData.question_boxs.forEach((question) => {
            if(this.has(question,allcard_group)==-1){
              allcard_group.push(this.formatQuesData(question, pageData.category))
            }

          })
          this.allcard_group = allcard_group;

          this.filter()
          if(resp.data.data.page_info.now_page==resp.data.data.page_info.total_page){
            this.end=true;
          }
          this.status='loaded'
        }else{
          this.status='error'
        }
        Bus.$emit('loading',false)
      },
      // 初始化
      init:async function (params) {
        this.buzy=true
        Object.assign(this.params,params)
        await ajax.all([
          Cart.getCardInfo(),
          Bus.quesBar.init(params),
        ]);

        await this.nextInit()
        this.buzy=false;
      },
    },

    mounted:async function () {
      updateTitle('本地化题库','','');
      let params = getInitParams();
      await this.init(params)

      Bus.quesBar.$on('nextInit', () =>{
        this.nextInit();
      })

      Bus.quesBar.$on('filter', () =>{
        this.filter();
      })
      Bus.$on('refreshCart',  ()=> {
        this.refreshCart(true);
      });
      // 如果购题车超出限制不能添加成功需要把select变更为false
      Bus.$on('updateCart',  ()=> {
        this.refreshCart(false);
      });

      // 页面load打点
      let form = params.form == 'tb' ? 'titlePackage' : 'titleEntry';
      let proSource = params.form == 'tb' ? '题包' : '题库入口';
      sendLog(log.module.m_homework,log.op.tk_load,{s0:'english',s1:form})
      sendLog('','',{event:'onlineEn_Assignment_EnterQuestionBank',logData:{platformType:'H5',proSource:proSource}})
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

  .container {
    padding-top: 1.2rem;
    max-width: 750px;
    margin: 0 auto;
    font-size: 0.28rem;
    -webkit-overflow-scrolling: touch;
  }
  .box {
    margin-bottom: 0.2rem;
  }
  .card23 {
    background: #FFFFFF;
    padding: 0.3rem 0.4rem;
    position: relative;
    font-size: 0.28rem;
    max-width: 750px;
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
  .buzy{
    text-align: center;
    height: 0.5rem;
    line-height: 0.5rem;
  }
</style>
