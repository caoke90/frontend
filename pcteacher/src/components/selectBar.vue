<template>
    <div>
        <div class="selectBar">
            <div class="banner">
                <div class="banner-wrap clearfix">
                    <p @click="selectBtn('word')" :class="{active: select === 'word'}">{{tabType.name}}<i :class="{cur: select == 'word'}"></i></p>
                    <p @click="selectBtn('point')" :class="{active: select === 'point'}"><span :class="ishaspoint?'blue':''">知识点</span><i :class="{cur: select == 'point'}"></i></p>
                    <p @click="selectBtn('type')" :class="{active: select === 'type'}"><span :class="ishastype?'blue':''">题型</span><i :class="{cur: select == 'type'}"></i></p>
                    <div class="switch">
                        <label>
                            <span class="mui-switch" :class="{isFilter: isFilter}" @click="filter_swith(this)"></span>
                        </label>
                        过滤已推荐
                    </div>
                </div>
            </div>
            <div class="content" :class='{word: select === "word"}' v-if="select">
                <div class="item" v-if="select == 'word'">
                    <div class="word-wrap">
                        <ul class="clearfix" v-if="condition_tree.wordList.length">
                            <li v-for="(item, key) in condition_tree.wordList" :class="{active: key== tabType.select}" @click="selectWord(item.key,item)">
                                {{item.name}}
                                <i></i>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="item" v-if="select == 'point'">
                    <div class="pointItem-wrap">
                        <ul class="clearfix" v-if="condition_tree.pointList.length">
                            <li v-for="(item, index) in condition_tree.pointList">
                                <label><input type="checkbox" :checked="item.select===true" @click="selectPoint(index)"></label>
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
                        <ul class="clearfix" v-if="condition_tree.typeList">
                            <li v-for="(item, index) in condition_tree.typeList">
                                <label><input type="checkbox" :checked="item.select===true" @click="selectType(index)"></label>
                                {{item.name}}
                            </li>
                        </ul>
                        <div class="btnItem">
                            <div class="btn clear cancelBtn" @click="reset('type')">重置</div>
                            <div class="btn ok" @click="confirm('type')">确定</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Bus from '@/marvel/bus'
    import vuex from '@/api/tcques'

    export default {
        name: 'selectBar',
        data: function(){
            return {
                select: '',
                isFilter: false,
                tabType: {
                    name: '',
                    select:0
                },
                condition_tree:{
                    pointselectArr:[],
                    typeselectArr:[],
                    wordList:[],
                    pointList: [ ],
                    typeList: [],
                },
                isTypeConfirm: false,
                isPointConfirm: false,
            }
        },
        computed: {
            ishaspoint:function () {
                var has=false
            },
            ishastype:function () {
                var has=false
                return has
            }
        },
        methods: {
            selectPoint: function(index){
                this.condition_tree.pointList.forEach((item, ind)=>{
                    if(index===ind){
                        item.select = !item.select
                    }
                })
            },
            selectType: function(index){
                this.condition_tree.typeList.forEach((item, ind)=>{
                    if(index===ind){
                        item.select = !item.select
                    }
                })
            },
            reset: function (select){
                if(select=== 'point'){
                    this.condition_tree.pointList.forEach((item, index)=>{
                        item.select = false
                    })
                }else{
                    this.condition_tree.typeList.forEach((item, index)=>{
                        item.select = false
                    })
                }
            },
            reset: function (selecttype) {
                if (selecttype === 'type') {
                    this.clear_slect(this.condition_tree.typeList)
                    console.log("清除typeList")
                    this.confirm('cancelType')
                } else if(selecttype === 'point') {
                    this.clear_slect(this.condition_tree.pointList)
                    console.log("清除pointList")
                    this.confirm('cancelPoint')
                }
            },
            clear_slect: function (obj) {
                for (let item in obj) {
                    obj[item].select = false
                }
            },
            confirm: function (seletedtype) {
                this.select = ''
                if(seletedtype == 'type'){
                    this.isTypeConfirm = true
                }else if(seletedtype == 'point'){
                    this.isPointConfirm = true
                }else if(seletedtype == 'cancelType'){
                    this.isTypeConfirm = false
                }else if(seletedtype == 'cancelPoint'){
                    this.isPointConfirm = false
                }
                console.log('seletedtype', seletedtype)
                vuex.search()
            },
            selectBtn: function (select) {
                if (this.select === select) {
                    this.select = ''
                    this.condition_tree.pointList.forEach((item,i)=>{
                        item.select=this.condition_tree.pointselectArr[i]
                    })
                    this.condition_tree.typeList.forEach((item,i)=>{
                        item.select=this.condition_tree.typeselectArr[i]
                    })
                } else {
                    this.select = select
                }
            },
            filter_swith:function(){
                this.select = '';
                this.isFilter=!this.isFilter
                let status = this.isFilter ? 'filter' : 'nofilter'
                Bus.$emit('filter')
            },
            // 选中词汇
            selectWord: function (i,item) {
                // 如果重复当前的直接返回
                if (item.name === this.tabType.name){
                    return false
                }
                this.tabType.select = i-1
                this.tabType.name = item.name
                if(this.select){
                    this.select = ''
                }
                vuex.select(item.key)
            },
            init:async function(params){
              vuex.bannerVue = this
              vuex.bkc_id = params.bkc_id
              vuex.fromParams = params
              this.$nextTick(()=>{
                  vuex.getBanner()
              })
            }
        },
        created: function (){
            vuex.bannerVue = this
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
    .selectBar{
        background: #FAFBFC;
        border-bottom: 1px solid #DBE6EE;
        position: relative;
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
                    border-right: 1px solid #DBE6EE;
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
            .word-wrap{
                width: 110px;
                ul{
                    border-bottom: 1px solid #DBE6EE;
                    border-right: 1px solid #DBE6EE;
                    box-shadow: 0 2px 4px 0 rgba(28,33,38,0.08);
                    li{
                        padding: 10px 10px 10px 14px;
                        font-size: 14px;
                        color: #555555;
                        cursor: pointer;
                        position: relative;
                    }
                    li.active{
                        background: #FFF!important;
                        cursor: default;
                        i{
                            position: absolute;
                            width: 12px;
                            height: 8px;
                            top: 50%;
                            right: 18px;
                            margin-top: -6px;
                            background: url(../assets/img/teacher/list-select-logo.png)
                        }
                    }
                    li:hover{
                        background: #F8F8F8;
                    }
                }
            }
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
        .content.word{
            position: absolute;
            top: 42px;
            left: 0;
            z-index: 99;
            border-top: none;
        }
    }
    .clearfix::after{
        display: block;
        content:'';
        clear: both;
        height:0;
    }
</style>
