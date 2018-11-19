<template>
    <div>
        <div class="subject" v-if="isloaded">
            <ul :class="{hidden: !expand}">
                <li v-for="(item, index) in listData" class="item" :class="{active:index===current}" @click="select(index,item.action.params)">
                    <div class="wrap">
                        <p class="title" :title="item.value">{{item.value}}
                            <!--<span class="num" v-if="item.cartSelected>0">{{item.cartSelected}}</span>-->
                        </p>
                        <p class="label">{{item.name}}</p>
                        <span class=""></span>
                    </div>
                </li>
            </ul>
            <div class="more" v-if="listData.length>6">
                <span :class="{expanded: !expand}" @click="expandHandle()">{{expand? '收起':'更多'}}<i></i></span>
            </div>
        </div>
        <div v-else>
        <msg style="height: 200px;" :card="{type:'loading'}"></msg>
    </div>
    </div>
</template>
<script>
    // 组件通信
    import Bus from '../../marvel/bus.js'
    // 网络请求
    import ajax from '@/api/ajax';
    //通过路径获取对象属性值
    import {hget}  from '@/utils/hobj';
    import msg from '@/components/cards/msg.vue';
    export default {
        name: 'subject',
        data: function(){
            return {
                expand: false,
                isloaded:false,
                current:0,
                listData:[],
                menuList:[],
                params:{
                    region_id:'',
                    grade_id:'',
                    list_type:'',
                    subtype_id:'',
                    subtype_id_type:''
                },
            }
        },
        components:{
            msg
        },
        methods:{
            expandHandle: function(){
                this.expand = !this.expand
            },
            getSubject: async function ({region_id,grade_id}) {
                const content = await ajax.post('/pc/v1/assign/listenSpeakSpecialList',{region_id,grade_id});
                if(content.data.message==="ok"){
                    this.listData=this.getsubjectData(content.data.data);
                    this.params.subtype_id=this.listData.length ? this.listData[0].key: 0;
                    this.params.subtype_id_type=this.listData.length ? this.listData[0].keyType: 0;
                    this.params.list_type=this.listData.length ? this.listData[0].action.params.list_type: 0;
                    this.current=0;
                }
            },
            getsubjectData:function (item) {
                let lists=[];
                item.length && item.forEach((b,k) =>{
                    item[k].list.length && item[k].list.forEach((im,index) =>{
                        im.name=b.name
                        lists.push(im)
                    })
                })
                return lists
            },
            select: function (num,param) {
                this.current = num;
                this.params.subtype_id=param.subtype_id;
                this.params.subtype_id_type=param.subtype_id_type;
                this.$emit('changeSubjectType',param)
            },
            init:async function (params){
                Object.assign( this.params,params)
                this.isloaded=false;
                await this.getSubject(params);
                this.expand = this.listData.length > 6 ? false: true
                this.isloaded=true
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
    .subject{
        background: #fff;
    ul{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    li{
        margin-bottom: .8rem;
        width:242px;
        margin: 0 10px 10px 0;
        box-sizing: border-box;
    &:nth-child(3n){
         margin-right: 0;
     }
    .wrap{
        border: 1px solid #dae6ee;
        position: relative;
        cursor: pointer;
        height: 58px;
    p.title{
        font-size: 14px;
        color: #555555;
        margin: 7px 0 0 11px;
        max-width: 195px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
        padding-right: 28px;
    span.num{
        position: absolute;
        right: 0px;
        top: 4px;
        width: 24px;
        height: 14px;
        font-size: 12px;
        color: #FFFFFF;
        display: inline-block;
        background: #159CFC;
        text-align: center;
        line-height: 15px;
        border-radius: 7px;
    }
    }
    p.label{
        margin: 0 0 0 11px;
        font-size: 12px;
        color: #7F7E7E;
    }
    }
    }
    li.active{
    .wrap{
        border: 1px solid #159CFC;
        background: #F5FBFF;
    span{
        display: inline-block;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 26px;
        height: 26px;
        background: url(../../assets/img/teacher/selected.png);
        z-index: 2;
    }
    }
    }
    }
    ul.hidden{
        height: 136px;
        overflow: hidden;
        width: 747px;
    }
    .more{
        height: 36px;
        text-align: center;
        padding: 10px 0;
    span{
        font-size: 14px;
        color: #159CFC;
        cursor: pointer;
        position: relative;
    i{
        display: inline-block;
        width: 12px;
        height: 9px;
        position: absolute;
        top: 4px;
        right: -17px;
        background: url(../../assets/img/teacher/nomore.png)
    }
    }
    span.expanded{
    i{
        background: url(../../assets/img/teacher/more.png)
    }
    }
    }
    }
</style>
