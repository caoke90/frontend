<template>
    <div>
        <div v-if="showLoading" style="height: 400px; background-color: white; width: 100%;position: relative;">
            <img src="../../assets/img/loading.gif" style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/>
        </div>
        <div v-else>
            <div class="paperlistwarp" v-if="question_data && question_data.length!=0">
                <div>
                    <div class="title" v-if="page_data.sameRegion">共<span>{{page_data.total_number}}</span>套听说套卷</div>
                    <div v-if="!page_data.sameRegion">
                        <div class="tj_empty" >
                            <img src="../../assets/img/msg/empty2.png">
                            <p>本地区暂无相关套卷</p>
                        </div>
                        <div class="title">已为您推荐 <span>{{page_data.total_number}}</span> 套同教材的听说套卷</div>
                    </div>
                    <div class="listWarp" v-for="(item,index) in question_data">
                        <div class="info">
                            <p>{{item.name}}</p>
                            <p>{{item.desc[0]}}<span>•</span>{{item.desc[1]}}</p>
                        </div>
                        <div class="btn"><a href="javascript:;" @click="openPaperPage(item)">进入选题</a></div>
                    </div>
                </div>
                <div class="pagination">
                    <el-pagination background layout="prev, pager, next"
                                   :page-size="pageInfo.page_size"
                                   :current-page="pageInfo.now_page"
                                   v-if="pageInfo.total_page>1"
                                   @current-change="handlesCurrentChange"
                                   :total="page_data.total_number"></el-pagination>
                </div>
            </div>
            <div class="emptyWarp" v-else>
                <msg style="height: 400px;" :card="{type:'empty',msg:'暂无满足条件的试卷'}"></msg>
            </div>
        </div>
    </div>
</template>

<script>
    import msg from '@/components/cards/msg.vue';
    import Bus from '../../marvel/bus.js';
    import ajax from '@/api/ajax';
    import qs from 'qs';
    export default {
        name: "tjcontent",
        data(){
            return{
                question_data:[],
                page_data:'',
                showLoading:true,
                params:{
                    region_id:'',
                    semester_id:'',
                    type:'',
                    year:'',
                    page:1,
                    page_size:10
                },
                pageInfo:''
            }
        },
        components:{
            msg
        },
        methods :{
            getPaperList:async function(params) {
                this.showLoading = true;
                //初始化请求页面数据
                const paperlist = await ajax.post('/pc/v1/assign/listenSpeakPaperList',params);
                this.page_data =paperlist.data.data;
                this.pageInfo = paperlist.data.data.page_info || {};
                this.question_data=paperlist.data.data.paperIds
                this.showLoading = false;
            },
            handlesCurrentChange (val){
                this.params.page=val
                this.getPaperList( this.params);
                this.$nextTick(()=>{
                    window.scrollTo(0, 0)
                })
            },
            openPaperPage: function (page) {
                let params = Object.assign({}, this.params,{
                    paper_id: page.id,
                    region_id:this.params.region_id,
                    grade_id:this.params.grade_id,
                    term_id:this.params.semester_id,
                    page_size:'',
                    page:''
                });
                let url = window.location.origin+(process.env.STAGE=="production"?"/s17":"")+"/pcteacher/lspdetail.html?"+qs.stringify(params);
                window.open(url,'_blank')
            },
            init:async function(params){
                this.params.page=1;
                Object.assign(this.params,params);
                await this.getPaperList(this.params)
            }
        }
    }
</script>
<style rel="stylesheet/scss" type="text/css" lang="scss">
    //分页样式重置
    .pagination{
        text-align: center;
        padding-bottom: 10px;
        margin-top: 20px;
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
<style lang="scss" rel="stylesheet/scss" type="text/css" scoped>
    .paperlistwarp,.emptyWarp{
        margin-top: 20px;
    .title{
        font-size: 14px;
        color: #555555;
        margin-bottom: 14px;
    span{
        color: #159CFC;
        font-weight: bold;
        margin: 0 4px;
    }
    }
    .tj_empty{
        margin: 48px auto;
        text-align: center;
    img{
        width: 68px;
        height: 60px;
        margin-bottom: 14px;
    }
    p{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9B9B9B;
    }
    }
    .listWarp{
        min-height: 73px;
        border:1px solid #dbe6ee;
        position: relative;
        padding: 15px;
        margin-bottom:10px;
    .info{
    p{
    &:first-child{
         font-size: 14px;
         color: #555555;
         padding-right: 136px;
         margin-bottom: 10px;
         overflow: hidden;
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
     }
    &:last-child{
         font-size: 12px;
         color: #7F7E7E;
    span{
        margin: 0 8px;
    }
    }
    }
    }
    .btn{
        position: absolute;
        right: 15px;
        top: 50%;
        margin-top: -15px;
        height:30px ;
        line-height:30px ;
        width: 80px;
        text-align: center;
    a{
        display: block;
        border-radius: 2px;
        background: #159CFC;
        color: #FFFFFF;
        font-size: 14px;
    &:hover{
         background: #5cbbff;
     }
    }
    }
    }
    }
</style>
