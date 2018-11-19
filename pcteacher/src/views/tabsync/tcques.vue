<template>
  <div>
    <quesBar ref="quesBar" v-show="allcard_group.length"></quesBar>
    <div class="tcbag">
      <template v-if="status=='loaded'">
        <div v-show="isLoading" style="height: 400px; background-color: white; width: 100%;position: relative;">
          <img src="../../assets/img/loading.gif" style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/>
        </div>
        <div v-show="!isLoading">
          <div class="box" v-for="(item, index) in allcard_group">
            <question  :question='item' :qindex="index" ></question>
          </div>
        </div>
        <div v-if="allcard_group.length===0">
          <msg style="height: 400px;" :card="{type:'empty'}"></msg>
        </div>
        <div class="pagination">
          <el-pagination background layout="prev, pager, next"
                         :page-size="params.page_size"
                         :current-page="params.page"
                         v-if="page_info.total_page>1"
                         @current-change="goPage"
                         :total="page_info.total_page*page_info.page_size"></el-pagination>
        </div>
      </template>
      <template v-else>
        <msg style="height: 400px;" :card="{type:'loading'}"></msg>
      </template>
    </div>
  </div>

</template>

<script>
  import Question from '@/models/question/Question'
  import msg from '@/components/cards/msg.vue'
  //购题车
  import Cart from '@/api/cart'
  // import vuex from '@/api/tcques'
  import Bus from '@/marvel/bus'
  import ajax from '../../api/ajax'
  import sa from '@/utils/sensorsdata'

  export default {
    name: 'tcques',
    data: function(){
      return{
        isselect: true,
        success: '',
        allcard_group: [],
        card_group:[],
        status: 'loading',
        isLoading: false,
        page_info: {
          now_page:1,
          page_size:10,
          total_page:20
        },
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
    computed:{

    },
    components:{
      quesBar:require('./quesBar.vue'),
      msg,
    },
    methods:{
      filter:function(){
        if(!this.$refs.quesBar.isFilter){
          this.card_group=this.allcard_group
        }else{
          let arr=[]
          this.allcard_group.forEach(function (question) {
            if(!question.isUsed){
              arr.push(question)
            }
          })
          this.allcard_group= arr
        }
      },

      toggle: function () {
        let questionIDList = []
        if(!this.card_group.length){return;}
        let isall = this.isselect;
        for (let i = 0; i < this.card_group.length; i++) {
          if (!isall) {
            this.card_group[i].selected = true;
          } else {
            this.card_group[i].selected = false;
          }
        }
        this.card_group.forEach((item)=>{
          questionIDList.push(item.id)
        })
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
        })
        const ques = new Question(question)
        ques.selected = Cart.hasQuestion(ques)
        return ques
      },
      has: function(question,card_group){
        let has = -1
        for(let i =0; i<card_group.length; i++){
          if(question.id == card_group[i].id){
            has = i
            break
          }
        }
        return has
      },
      // 页面跳转
      goPage:async function(page){
        this.params.page=page;
        this.isLoading=true;
        const resp = await this.getcontent(this.params);
        this.isLoading=false;
        if(resp.data.message=='ok') {
          const pageData = resp.data.data
          const allcard_group = [];
          pageData.question_boxs.forEach((question) => {
            allcard_group.push(this.formatQuesData(question, pageData.category))
          })
          this.allcard_group =allcard_group;
          this.filter()
          this.$nextTick(()=>{
            window.scrollTo(0, 0)
          })
        }
      },
      refreshCart: async function () {
        this.allcard_group.forEach((item)=>{
          item.selected =  Cart.hasQuestion(item);
        })
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
        return await ajax.post('/pc/v1/assign/getQuestionsFromQuestionBank',this.formatData(params));
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

      nextInit:async function(){
        this.status='loading';
        this.params.page=1;
        this.params.algo_type= this.$refs.quesBar.params.algo_type;
        this.params.kps=this.$refs.quesBar.params.kps;
        this.params.content_sub_type_ids= this.$refs.quesBar.params.content_sub_type_ids;
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
          this.page_info = resp.data.data.page_info
          if(resp.data.data.page_info.now_page==resp.data.data.page_info.total_page){
            this.end=true;
          }
          this.status='loaded'
        }else{
          this.status='error'
        }
      },
      init:async function (params) {
        window.currentScene = '题库'
        // 初始化参数
        Object.assign(this.params,params)
        this.sendLog()
        await this.$refs.quesBar.init(params)
        await this.nextInit()
      },
      //神策打点
      sendLog:function(){
        sa.track('onlineEn_Assignment_EnterQuestionBank', {
          proSource: Bus.tabsync.tabs[Bus.tabsync.curIndex]
        })
      }
    },
    mounted:function () {
      this.$refs.quesBar.$on('nextInit', () =>{
        this.nextInit()
      })
      this.$refs.quesBar.$on('filter', () =>{
        this.filter()
      })
      Bus.$on('updateCart',  ()=> {
        this.refreshCart()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .tcbag{
    padding: 10px;
    .box{
      margin-bottom: 20px;
      .card{
        text-align: right;
        line-height: 30px;
        span{
          font-size: 14px;
          color: #159CFC;
        }
        .btn{
          width: 80px;
          height: 30px;
          line-height: 30px;
          border: 1px solid #159CFC;
          color: #159CFC;
          border-radius: 2px;
          text-align: center;
          float: right;
          margin-left: 10px;
          cursor: pointer;
        }
        .btn.remove{
          background: #159CFC;
          color: #fff;
          border: none;
        }
      }
    }
  }

  .clearfix::after{
    display: block;
    content:'';
    clear: both;
    height:0;
  }
</style>
