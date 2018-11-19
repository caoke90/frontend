import ajax from './ajax';
import Bus from '../marvel/bus';
import qs from 'qs';
//购物车
import Cart from '../api/cart';
import {getInitParams} from '../common/js/external';
const urlParams=Object.assign({
  bkc_id:"", //单元id 是
  unit_id:"", //单元id (unit id)
  bk_id:"", //教材id 是
  class_level:'',//年级 是
  package_type:"REVIEW_VOCAB", //题包类型 否
},getInitParams());

// 映射表
const map={
  REVIEW_VOCAB:{name:'词汇',key:1},
  REVIEW_SENTENCES:{name:'句型',key:2},
  REVIEW_ORAL:{name:'口语',key:3},
  REVIEW_LISTENING:{name:'听力',key:4},
  REVIEW_GRAMMAR:{name:'语法',key:5},
  REVIEW_READ:{name:'阅读',key:6},
};

const map2={
  1:"REVIEW_VOCAB",
  2:"REVIEW_SENTENCES",
  3:"REVIEW_ORAL",
  4:"REVIEW_LISTENING",
  5:"REVIEW_GRAMMAR",
  6:"REVIEW_READ",
};

export default {
  bannerVue:null,
  pageVue:null,
  urlParams:urlParams,

  // banner部分
  bannerParams:{
    bkc_id:urlParams.bkc_id, //单元id 是
    model:map[urlParams.package_type].key, //模块 否
  },
  // 内容部分
  params:{
    bk_id:urlParams.bk_id, //教材id 是
    bkc_id:urlParams.bkc_id, //课时id 是
    unit_id:urlParams.unit_id, //单元id 是
    algo_type:urlParams.package_type, //题包类型 是
    class_level:urlParams.class_level, //年级 是
    kps:[], //知识点 是
    content_sub_type_ids:[], //知识点 否
    page:1,
    page_size:10,
  },


  // 题库页面数据初始化请求后返回业务逻辑页面数据
  async init(){

    await ajax.all([
      this.getBanner(),
      Cart.getCardInfo()
    ]);

    const resp=await this.getcontent();
    this.pageVue.update(resp)
  },

  // 交互点 选择题型
  async select(key){
    Bus.$emit('loading',true)
    this.bannerParams.model =key;
    this.params.page = 1;

    await this.getBanner();
    const resp=await this.getcontent();
    this.pageVue.update(resp)
    Bus.$emit('loading',false)
  },

  // 交互点 搜索
  async search(){
    Bus.$emit('loading',true)
    this.params.page=1;
    //缓存之前的
    this.bannerVue.condition_tree.pointList.forEach( (item,i) =>{
      this.bannerVue.condition_tree.pointselectArr[i]=item.select
    });
    this.bannerVue.condition_tree.typeList.forEach( (item,i) =>{
      this.bannerVue.condition_tree.typeselectArr[i]=item.select
    });
    const resp=await this.getcontent();
    this.pageVue.update(resp)
    Bus.$emit('loading',false)
  },

  // 交互点 下一页
  loadmore:async function(){
    this.params.page+=1;
    const resp=await this.getcontent()
    this.pageVue.loadmore(resp)
  },

  async getBanner() {
    // 单元id bkcId
    const resp=await ajax.post('/assign/questionBankSearchCondition',this.bannerParams);
    // 解构赋值
    const {model,knowledge_point,question_type}=resp.data.data.condition_tree;
    const pointselectArr = [];
    knowledge_point.forEach(function (item) {
      pointselectArr.push(false);
      item.select=false;
    });
    const typeselectArr = [];
    question_type.forEach(function (item) {
      typeselectArr.push(false)
      item.select=false;
    });
    Object.assign(this.bannerVue.condition_tree,{
      pointselectArr:pointselectArr,
      typeselectArr:typeselectArr,
      wordList:model,
      pointList:knowledge_point,
      typeList:question_type,
    });

    let select=0;
    let name='';
    const key=this.bannerParams.model
    model.forEach((item,i) =>{
      if(item.key==key){
        this.bannerVue.tabType.select=i
        this.bannerVue.tabType.name=item.name
      }
    })
  },


  // 设置请求删选后题目的参数
  setParams:function () {
    // 词汇
    this.params.algo_type = map2[this.bannerParams.model];

    // 知识点
    const selectArr=[];
    const allArr=[];

    this.bannerVue.condition_tree.pointList.forEach(function (item) {
      if(item.select){
        selectArr.push(item.kp_id);
      }
      allArr.push(item.kp_id);
    });
    this.params.kps = selectArr.length===0?allArr:selectArr;
    if(allArr.length===0){
      delete this.params.kps;
    }

    // 题型
    const typeArr=[];
    const allTypeArr=[];
    this.bannerVue.condition_tree.typeList.forEach(function (item) {
      if(item.select){
        typeArr.push(item.nid)
      }
      allTypeArr.push(item.nid)
    });

    if (typeArr.length===0) {
      delete this.params.content_sub_type_ids;
    }
    else {
      this.params.content_sub_type_ids = typeArr;
    }
  },

  // 请求具体的题目数据
  async getcontent(){
    this.setParams();
    return await ajax.post('/assign/getQuestionsFromQuestionBank',this.formatData(this.params));
  },

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
  }
}



