import ajax from './ajax'
import Bus from '@/marvel/bus'
import Cart from '@/api/cart'

const urlParams=Object.assign({
    bkc_id:"", //单元id 是
    unit_id:"", //单元id (unit id)
    bk_id:"", //教材id 是
    class_level:'',//年级 是
    package_type:"REVIEW_VOCAB", //题包类型 否
},{})

// 映射表
// const map= {
//     REVIEW_VOCAB:{name:'词汇',key:1},
//     REVIEW_SENTENCES:{name:'句型',key:2},
//     REVIEW_ORAL:{name:'口语',key:3},
//     REVIEW_LISTENING:{name:'听力',key:4},
//     REVIEW_GRAMMAR:{name:'语法',key:5},
//     REVIEW_READ:{name:'阅读',key:6},
// }

// const map2={
//     1:"REVIEW_VOCAB",
//     2:"REVIEW_SENTENCES",
//     3:"REVIEW_ORAL",
//     4:"REVIEW_LISTENING",
//     5:"REVIEW_GRAMMAR",
//     6:"REVIEW_READ",
// }
const map2 = {}

export default {
    bannerVue: null,
    bkc_id: 0,
    fromParams: null,
    pageVue:null,
    // banner部分
    bannerParams:{
        bkc_id: '', //单元id 是
        model: 1, //模块 否
    },
    // 内容部分
    params:{
        bk_id: '', //教材id 是
        bkc_id: '', //课时id 是
        unit_id: '',//单元id 是
        algo_type: '', //题包类型 是
        class_level: '', //年级 是
        kps:[], //知识点 是
        content_sub_type_ids:[], //知识点 否
        page:1,
        page_size:10,
    },
    async init(bannerParams){
        await ajax.all([
          this.getBanner(bannerParams),
          Cart.getCardInfo()
        ])
        const resp= await this.getcontent();
        this.pageVue.update(resp)
    },
    async setData (respData, k){
        let model = [], knowledge_point=[], question_type = []
        Object.keys(respData).forEach((item, index)=>{
            let temp ={}
            if(index === k-1){
                temp.checked =1
                temp.name = respData[item].name
                temp.key = index+1
                knowledge_point= respData[item].kps
                question_type = knowledge_point[0]['subtypes']
                this.bannerParams.model = index+1
                map2[index+1] = item
            }else{
                temp.name = respData[item].name
                temp.key = index+1
                map2[index+1] = item
            }
            model.push(temp)
            temp = {}
        })
        const pointselectArr = []
        knowledge_point.forEach(function (item) {
            pointselectArr.push(false)
            item.select=false
        })
        const typeselectArr = []
        question_type.forEach(function (item) {
            typeselectArr.push(false)
            item.select=false
        })
        Object.assign(this.bannerVue.condition_tree,{
            pointselectArr:pointselectArr,
            typeselectArr:typeselectArr,
            wordList:model,
            pointList:knowledge_point,
            typeList:question_type,
        })
        const key = this.bannerParams.model
        model.forEach((item,i) =>{
            if(item.key== key){
                this.bannerVue.tabType.select=i
                this.bannerVue.tabType.name=item.name
            }
        })
    },
    async getBanner() {
        const resp=await ajax.post('pc/v1/assign/newQuestionBankSearchCondition', Object.assign(this.bannerParams, {
            bkc_id: this.bkc_id
        }))
        // 解构赋值
        const respData = resp.data.data 
        this.respData = respData
        await this.setData(respData, 0)
    },
    // 设置请求删选后题目的参数
    setParams:async function () {
        // 词汇
        this.params.algo_type = map2[this.bannerParams.model]
        // 知识点
        const selectArr=[]
        this.bannerVue.condition_tree.pointList.forEach(function (item) {
            if(item.select){
                selectArr.push(item.id)
            }
        })
        this.params.kps = selectArr.length ===0 ? [] : selectArr
        // 题型
        const typeArr=[]
        this.bannerVue.condition_tree.typeList.forEach(function (item) {
            if(item.select){
                typeArr.push(item.id)
            }
        })
        this.params.content_sub_type_ids = typeArr
    },
    // 请求具体的题目数据
    async getcontent(){
        await this.setParams()
        return await ajax.post('pc/v1/assign/getQuestionsFromQuestionBank', Object.assign({} ,this.formatData(this.params), this.fromParams))
    },
    async selectWordLabel (k){
        let respData = this.respData
        await this.setData(respData, k)
    },
    async select(key){
        Bus.$emit('tcquesLoading', true)
        this.selectWordLabel(key)
        this.bannerParams.model = key
        this.params.page = 1
        const resp = await this.getcontent()
        this.pageVue.update(resp)
        Bus.$emit('tcquesLoading', false)
    },
    // 交互点 搜索
    async search(){
        Bus.$emit('tcquesLoading', true)
        this.params.page=1
        // console.log('condition_tree', this.bannerVue.condition_tree)
        //缓存之前的
        this.bannerVue.condition_tree.pointList.forEach( (item,i) =>{
            this.bannerVue.condition_tree.pointselectArr[i]=item.select
        })
        this.bannerVue.condition_tree.typeList.forEach( (item,i) =>{
            this.bannerVue.condition_tree.typeselectArr[i]=item.select
        })
        const resp=await this.getcontent()
        this.pageVue.update(resp)
        Bus.$emit('tcquesLoading', false)
    },
    formatData:function (params) {
        const data={}
        for (let k in params) {
            if (typeof params[k] == 'object') {
                data[k] = JSON.stringify(params[k])
            } else {
                data[k]=params[k]
            }
        }
        return data
    },
}
