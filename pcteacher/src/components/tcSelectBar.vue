<template>
    <div>
        <div class="selectBar">
            <div class="banner">
                <div class="banner-wrap clearfix">
                    <template v-for="(item,key) in tabType">
                        <p class="br" @click="selectBtn(key)" :class="{active: select === key}">
                            <span>{{item}}</span>
                            <i></i>
                        </p>
                    </template>
                    <div class="switch">
                        <label>
                            <span class="mui-switch" :class="{isFilter: isFilter}"  @click="filter_swith(this)"></span>
                        </label>
                        过滤已推荐
                    </div>
                </div>
            </div>
            <div class="content" v-if="select">
                <div class="item" v-if="select == 'point'">
                    <div class="pointItem-wrap">
                        <ul class="clearfix">
                            <li v-for="(item, key) in pointList" @click="selectPoint(key)" :key="key">
                                <label><input type="checkbox" :checked="item.select===true"></label>
                                {{item.name}}
                            </li>
                        </ul>
                        <div class="btnItem">
                            <div class="btn clear cancelBtn" @click="reset(select)">重置</div>
                            <div class="btn ok" @click="confirm('point')">确定</div>
                        </div>
                    </div>
                </div>
                <div class="item" v-if="select == 'type'">
                    <div class="pointItem-wrap">
                        <ul class="clearfix">
                            <li v-for="(item, key) in typeList" @click="selectType(key)" :key="key">
                                <label>
                                    <input type="checkbox" :checked="item.select===true">
                                </label>
                                {{item.name}}
                            </li>
                        </ul>
                        <div class="btnItem">
                            <div class="btn clear cancelBtn" @click="reset(select)">重置</div>
                            <div class="btn ok" @click="confirm('type')">确定</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    // 组件通信
    import Bus from '@/marvel/bus.js'

    export default {
        name: 'tcSelectBar',
        data: function(){
            return {
                select: '',
                isFilter: false,
                isPointConfirm:false,
                isTypeConfirm:false,
                tabType: {
                    point: '知识点',
                    type: '题型'
                },
                pointList: [],
                typeList: [],
                pointselectArr:[],
                typeselectArr:[],
            }
        },
        methods: {
            selectPoint: function(i){
                this.pointList[i].select = !this.pointList[i].select
            },
            selectType: function (i) {
                this.typeList[i].select = !this.typeList[i].select
            },
            selectBtn: function (select) {
                if (this.select === select) {
                    this.select = ''
                    this.pointList.forEach((item,i)=>{
                        item.select=this.pointselectArr[i]
                    })
                    this.typeList.forEach((item,i)=>{
                        item.select=this.typeselectArr[i]
                    })
                } else {
                    this.select = select
                }
                this.typeList = JSON.parse(JSON.stringify(this.typeList))
            },
            reset: function (selecttype) {
                if (selecttype === 'type') {
                    this.clear_slect(this.typeList)
                    // console.log("清除typeList")
                    this.confirm('cancelType');
                }else if(selecttype === 'point') {
                    this.clear_slect(this.pointList)
                    // console.log("清除pointList")
                    this.confirm('cancelPoint')
                }
            },
            confirm: function (seletedtype) {
                let vm = this
                vm.select = ''
                if(seletedtype == 'type'){
                    vm.isTypeConfirm = true
                }else if(seletedtype == 'point'){
                    vm.isPointConfirm = true
                }else if(seletedtype == 'cancelType'){
                    vm.isTypeConfirm = false
                }else if(seletedtype == 'cancelPoint'){
                    vm.isPointConfirm = false
                }
                this.send_filter()
            },
            clear_slect: function (obj) {
                for (let item in obj) {
                    obj[item].select = false
                }
            },
            filter_swith: function () {

                if(!this.isFilter){
                    this.select = ''
                }
                this.isFilter = !this.isFilter
                this.send_filter()
            },
            send_filter: function(){
                //缓存之前的
                this.pointList.forEach( (item,i) =>{
                    this.pointselectArr[i]=item.select
                })
                this.typeList.forEach( (item,i) =>{
                    this.typeselectArr[i]=item.select
                })
                let vm = this, pointList=[], typeList=[]
                vm.pointList.forEach((item)=>{
                    if(item.select){
                        pointList.push(item.id)
                    }
                })
                vm.typeList.forEach((item)=>{
                    if(item.select){
                        typeList.push(item.nid)
                    }
                })
                Bus.$emit('transferSelectData',{
                    pointList,
                    typeList,
                    isFilter: vm.isFilter
                })
            },
          init:async function(){

          }
        },
        created: function (){
            let vm = this
            Bus.$on('transferBarData', function(data){
                vm.pointList = data.words
                vm.typeList = data.content_types
                vm.pointList.forEach( (item,i) =>{
                    vm.pointselectArr[i]=item.select
                })
                vm.typeList.forEach( (item,i) =>{
                    vm.typeselectArr[i]= item.select
                })
            })
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
    .selectBar{
        background: #FAFBFC;
        border-bottom: 1px solid #DBE6EE;
        .banner{
            position: relative;
            padding-top: 42px;
            &-wrap{
                height: 43px;
                overflow: hidden;
                position: absolute;
                top: 0px;
                left: 0;
                z-index: 20;
                background: #FAFBFC;
                p{
                    float: left;
                    padding: 10px;
                    font-size: 14px;
                    min-width: 110px;
                    text-align: center;
                    cursor: pointer;
                    height: 43px;
                    border-bottom: 1px solid #DBE6EE;
                    i{
                        background: url(../assets/img/tri_normal.png) no-repeat;
                        background-size: 100% 100%;
                        display: inline-block;
                        width: 11px;
                        height: 11px;
                        margin: 0 0 0 5px;
                    }
                }
                p.active{
                    background: #fff;
                    border-bottom: 1px solid #FFF;
                    color: #555;
                    i{
                        background: url(../assets/img/arrow_up.png) no-repeat;
                        background-position: 0 50%;
                        background-size: 100% auto;
                    }
                }
                p.br{
                    border-right: 1px solid #DBE6EE;
                }
                .switch{
                    float: left;
                    padding: 10px 10px 10px 10px;
                    text-align: center;
                    line-height: 20px;
                    font-size: 14px;
                    border-bottom: 1px solid #DBE6EE;
                    height: 43px;
                    label{
                        float: left;
                        width: 20px;
                        height: 20px;
                        margin-right: 9px;
                        span{
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            background: #FFFFFF;
                            border: 1px solid #D8D8D8;
                            border-radius: 2px;
                            box-sizing: border-box;
                            cursor: pointer;
                        }
                        span.isFilter{
                            background: url(../assets/img/teacher/list-select-logo.png);
                            background-repeat: no-repeat;
                            background-position: 3px 5px;
                        }
                    }
                }
            }
        }
        .content{
            border-top: 1px solid #DBE6EE;
            background: #fff;
            .pointItem-wrap{
                padding-bottom: 14px;
                ul{
                    padding: 20px 20px 9px 14px;
                    li{
                        float: left;
                        margin-right: 20px;
                        margin-bottom: 14px;
                        font-size: 14px;
                        height: 14px;
                        line-height: 14px;
                        color: #555555;
                        label{
                            background: #FFFFFF;
                            height: 14px;
                            width: 14px;
                            display: inline-block;
                            margin-right: 6px;
                            input{
                                margin: 0;
                                height: 14px;
                                width: 14px;
                                display: inline-block;
                            }
                        }
                    }
                }
                .btnItem{
                    text-align: center;
                    .btn{
                        background: #FFFFFF;
                        border: 1px solid #159CFC;
                        border-radius: 2px;
                        width: 80px;
                        height: 30px;
                        line-height: 30px;
                        font-size: 14px;
                        color: #159CFC;
                        display: inline-block;
                        margin-right: 14px;
                        cursor: pointer;
                    }
                    .btn.ok{
                       background: #159CFC;
                       color: #fff;
                    }
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
