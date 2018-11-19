<template>
    <div class="questionContainer">
        <div v-if="!isloading">
            <div class="questionWarp" v-if="cardGroup&& cardGroup.length!=0">
                <div class="box" v-for="(item,index) in cardGroup">
                    <question :question='item' :qindex="index" ></question>
                </div>
                <div class="paginationWarp">
                    <el-pagination background layout="prev, pager, next"
                                   :page-size="pageInfo.page_size"
                                   :current-page="pageInfo.now_page"
                                   v-if="pageInfo.total_page>1"
                                   @current-change="handlesCurrentChange"
                                   :total="pageInfo.total_number "></el-pagination>
                </div>
            </div>
            <div class="emptyWarp" v-else>
                <msg style="height: 400px;" :card="{type:'empty'}"></msg>
            </div>
        </div>
        <div v-else style="height: 400px; background-color: white; width: 100%;position: relative;">
            <img src="../../assets/img/loading.gif" style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/>
        </div>
    </div>
</template>
<script>
    import msg from '@/components/cards/msg.vue';
    // 网络请求
    import ajax from '@/api/ajax';
    //购物车
    import Cart from '@/api/cart';
    // 题目生成器
    import Question from '@/models/question/Question'
    // util
    import { hget, vExtend }  from '@/utils/hobj';
    import { getInitParams} from '@/common/js/external/index';
    //通信
    import Bus from '@/marvel/bus.js'
    export default {
        name: "zqcontent",
        data() {
            return{
                isloading:true,
                cardGroup: [],
                params :{
                    region_id:'',
                    grade_id:'',
                    subtype_id:'',
                    subtype_id_type:'',
                    page:1,
                    page_size:10
                }
            }
        },
        components:{
            msg
        },
        methods:{
            refreshData:async function (reparams){
                this.isloading=true;
                let [content] = await ajax.all([
                    ajax.post('/pc/v1/assign/listenSpeakSpecialContent',reparams),
                    Cart.getCardInfo()
                ]);
                if(hget(content, 'data.message') === 'ok'){
                    let data = hget(content, 'data.data', {});
                    let questionBoxs = data.question_boxs || [];
                    let cardGroupTemp = [];
                    let category = data.category || {};
                    questionBoxs.length && questionBoxs.forEach((item) => {
                        item.category = category;
                        let itemTemp = new Question(item);
                        itemTemp.selected =  Cart.hasQuestion(itemTemp);
                        cardGroupTemp.push(itemTemp);
                    })
                    this.pageInfo = data.page_info || {};
                    this.cardGroup =cardGroupTemp;
                    this.isloading=false;
                }else{
                    this.isloading=false;
                    this.cardGroup=[]
                }
            },
            refreshCart: async function () {
                this.cardGroup.forEach((item)=>{
                    item.selected =  Cart.hasQuestion(item);
                })
            },
            init:async function(params){
                this.isloading=true;
                //初始化参数
                this.params.page=1;
                Object.assign( this.params,params);
                await this.refreshData( this.params);
                this.isloading=false;
            },
            handlesCurrentChange (val){
                this.params.page=val;
                this.refreshData( this.params);
                this.$nextTick(()=>{
                    window.scrollTo(0, 0)
                })
            }
        },
        created () {
            Bus.$on('updateCart',  ()=> {
                this.refreshCart()
            })
        }
    }
</script>
<style scoped lang="scss" rel="stylesheet/scss" type="text/css">
    .questionContainer{
        border: 1px solid #d6dee3;
        background: #FFFFFF;
        min-height: 400px;
        margin-top: 10px;
        padding: 20px;
        position: relative;
    .box{
        margin-bottom: 10px;
    }
    .paginationWarp{
        width: 100%;
        padding-top: 20px;
        text-align: center;
        padding-bottom: 10px;
    }
    }
</style>
<style rel="stylesheet/scss" type="text/css" lang="scss">
    //分页样式重置
    .paginationWarp{
    .el-pager{
    li{
        background-color: #f5f8fb !important;
        font-size: 14px;
        color: #7F7E7E !important;
        font-weight: normal;
    &:hover{
         background: #ebf0f4 !important;
         color: #7F7E7E !important;
     }
    }
    .active{
        background: #159cfc !important;
        color: #FFFFFF !important;
    &:hover{
         background: #159cfc !important;
         color: #FFFFFF !important;
     }
    }
    }
    }
</style>
