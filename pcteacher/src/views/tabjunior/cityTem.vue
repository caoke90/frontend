<template>
    <div>
        <div class="top">
            <div class="filterList clearfix">
                <p>来源：</p>
                <div class="sourceLabel">
                    <p>
                        <span @click.stop="showCity">
                            <span>{{curr.currCity}}</span>
                            <span class="w-icon-arrow" style="margin-right:-4px;margin-left:6px" :class="[showCityTem?'w-icon-arrow-topBlue':'']"></span>
                        </span>
                        <span class="cityWarp" v-if="showCityTem" @click.stop="handleClose">
                            <div class="tab">
                                <span  v-for="(item,index) in tabs" @click.stop="changeTab(index)" :class="{activeTab: index===tabsNum}">{{item}}</span>
                            </div>
                            <div class="content">
                                <div class="contentWarp provinceList clearfix" v-if="tabsNum===0">
                                    <div class="item"
                                         v-for="(item,index) in proviceData"
                                         :key="index"
                                         :class="{curr: item===currProviceData}"
                                         @click.stop="selectProvice(item)"><a href="javascript:;">{{item.name}}</a></div>
                                </div>
                                <div class="contentWarp cityList clearfix" v-else>
                                    <div class="item"
                                         v-for="(item,index) in cityData"
                                         :key="index"
                                         :class="{curr: item===currCityData}"
                                         @click="selectCity(item)"><a href="javascript:;">{{item.name}}</a></div>
                                </div>
                            </div>
                        </span>
                    </p>
                    <p>
                        <span @click.stop="showLevel">
                            <span>{{isShowselect  ? curr.currSem:curr.currLevel}}</span>
                            <span class="w-icon-arrow " style="margin-right:-4px;margin-left:6px" :class="[showLevelTem?'w-icon-arrow-topBlue':'']"></span>
                        </span>
                        <span class="leveWarp" v-if="showLevelTem">
                            <ul v-if="isShowselect">
                                <li  :class="{active:item===currSemData}"
                                     v-for="(item,index) in semsData"
                                     @click="selectLevel(item,currSemData)">{{item.name}}<span></span></li>
                            </ul>
                            <ul v-else>
                                <li  :class="{active:item===currLeveData}"
                                     v-for="(item,index) in levelData"
                                     @click="selectLevel(item,currLeveData)">{{item.name}}<span></span></li>
                            </ul>
                        </span>
                    </p>
                </div>
            </div>
            <div class="filterList clearfix" v-if="isShowselect">
                <p>类型：</p>
                <div class="sourceLabel">
                    <p class="labelList">
                        <span v-for="(item,index) in configData.types" :key="index" :class="{active: item===currTypeData}" @click="selectTypes(item)">{{item.name}}</span>
                    </p>
                </div>
            </div>
            <div class="filterList clearfix"  v-if="isShowselect">
                <p>年份：</p>
                <div class="sourceLabel">
                    <p class="labelList">
                        <span  v-for=" (item,index) in configData.years" :key="index" :class="{active: item===currYearData}" @click="selectYears(item)">{{item.name}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Bus from '../../marvel/bus.js';
    import ajax from '@/api/ajax'
    import {hget}  from '@/utils/hobj';
    let cacheData={
        curr: 0,
        showCityTem: false,
        showLevelTem: false,
        tabs: ['省份', '城市'],
        tabsNum: 1,
        defaultData:'',
        levelData:[],
        semsData:[],
        currCityData: [],
        cacheCity:[],
        cachePro:[],
        currProviceData: [],
        currSemData: [],
        currLeveData:[],
        currYearData: [],
        currTypeData: [],
        params: {
            'region_id': '', //地区id
            'semester_id': '',//学期id
            'grade_id': '', //年级id
            'type': '',//题型
            'year': ''//年份
        },
        curr: {
            currCity: '',
            currLevel: '',
            currSem:''
        },
        configData: '',
        proviceData: [],
        cityData: []
    };
    export default {
        name: "cityTem",
        props: ['isShowselect', 'isready'],
        data() {
            return cacheData;
            return {
                curr: 0,
                showCityTem: false,
                showLevelTem: false,
                tabs: ['省份', '城市'],
                tabsNum: 1,
                defaultData:'',
                levelData:[],
                semsData:[],
                cacheCity:[],
                cachePro:[],
                currCityData: [],
                currProviceData: [],
                currSemData: [],
                currLeveData:[],
                currYearData: [],
                currTypeData: [],
                params: {
                    'region_id': '', //地区id
                    'semester_id': '',//学期id
                    'grade_id': '', //年级id
                    'type': '',//题型
                    'year': ''//年份
                },
                curr: {
                    currCity: '',
                    currLevel: '',
                    currSem:''
                },
                configData: '',
                proviceData: [],
                cityData: []
            }
        },
        methods: {
            changeTab: function (index) {
                this.tabsNum = index
            },
            selectProvice(item) {
                if (item === this.currProviceData) {
                    return;
                }
                this.currProviceData = item;
                this.cityData = item.items;
                this.tabsNum = 1;
            },
            selectCity:async function(item) {
                if (item === this.currCityData) {
                    return;
                }
                this.currCityData = item;
                this.params.region_id = item.code;
                this.curr.currCity = item.name;
                this.showCityTem = false;
                this.cacheCity=this.cityData;
                this.cachePro= this.currProviceData;
                await this.loadConfig(this.params.region_id);
                //重置
                this.params.type = '';
                this.params.year = '';
                //听说套卷 调用
                await this.$emit('zqLoadList', this.params);
                //听说专区
                await this.$emit('zqLoadcontent', this.params)
            },
            selectLevel(item,data) {
                if(data==this.currSemData){
                    if (item === this.currSemData) {
                        return
                    }
                    this.currSemData = item;
                    this.curr.currSem = item.name;
                    this.params.semester_id = item.sem_id;
                    this.levelData.forEach((items) =>{
                        if(items.grade_id==item.grade_id){
                            this.params.grade_id = items.grade_id;
                            this.currLeveData=items;
                            this.curr.currLevel = items.name;
                        }
                    });
                }else if(data==this.currLeveData){
                    if (item === this.currLeveData) {
                        return
                    }
                    this.currLeveData = item;
                    this.curr.currLevel = item.name;
                    this.params.grade_id = item.grade_id;
                    let listData=[];
                    this.semsData.forEach((list,index) =>{
                        if( list.grade_id==item.grade_id){
                            listData.push(list);
                        }
                    });
                    if (this.curr.currTerm==1&& listData[1]){
                        this.params.semester_id= listData[1].sem_id;
                        this.currSemData=listData[1]
                        this.curr.currSem = listData[1].name;
                    }else{
                        this.params.semester_id= listData[0].sem_id;
                        this.currSemData=listData[0];
                        this.curr.currSem = listData[0].name;
                    }
                }
                this.showLevelTem = false;
                if (this.configData.types[0]) {
                    this.currTypeData = this.configData.types[0];
                    this.params.type = this.currTypeData.type_id;
                }
                if (this.configData.years[0]) {
                    this.currYearData = this.configData.years[0];
                    this.params.year = this.currYearData.year_id;
                }
                //听说套卷
                this.$emit('zqLoadList', this.params);
                //听说专区
                this.$emit('zqLoadcontent', {
                    region_id: this.params.region_id,
                    grade_id: this.params.grade_id
                });
                if (!this.isShowselect) {
                    Bus.$emit('tjlistLoad')
                }
            },
            selectTypes(item) {
                if (item === this.currTypeData) {
                    return
                };
                this.currTypeData = item;
                this.params.type = item.type_id;
                if (this.configData.years[0]) {
                    this.currYearData = this.configData.years[0];
                    this.params.year = this.currYearData.year_id;
                }
                this.$emit('zqLoadList', this.params)
            },
            selectYears(item) {
                if (item === this.currYearData) {
                    return
                };
                this.currYearData = item;
                this.params.year = item.year_id;
                this.$emit('zqLoadList', this.params)
            },
            //加载地区
            loadAreaData: async function () {
                const datalist = await ajax.post('/pc/v1/assign/getArea');
                let temp = datalist.data.data.list;
                this.proviceData = temp;
            },
            //基础筛选
            loadConfig: async function (id) {
                const datalist = await ajax.post('/pc/v1/assign/listenSpeakConfig', {region_id: id});
                let temp = datalist.data.data;
                this.defaultData=temp.default_config;
                temp.types.unshift({
                    "name": "全部",
                    "type_id": ""
                });
                temp.years.unshift({
                    "name": "全部",
                    "year_id": ""
                });
                if (temp.types[0]) {
                    this.currTypeData = temp.types[0]
                }
                if (temp.years[0]) {
                    this.currYearData = temp.years[0]
                }
                this.configData = temp;
                this.semsData=temp.semesters;
                this.levelData=temp.grades;
                let vm=this;
                    this.semsData.forEach(function (item) {
                        if(item.sem_id==vm.defaultData.semester_id){
                            vm.currSemData=item
                        }
                    });
                    this.levelData.forEach(function (item) {
                        if(item.grade_id==vm.defaultData.grade_id){
                            vm.currLeveData=item
                        }
                    });
                this.curr.currSem =vm.currSemData.name;
                this.params.semester_id = vm.currSemData.sem_id;
                this.params.grade_id = vm.currSemData.grade_id;
                this.curr.currLevel =vm.currLeveData.name;
                this.proviceData.forEach((item) =>{
                    if(item.code==this.defaultData.region_pro_id){
                        this.currProviceData=item;
                        this.cityData=item.items;
                        this.cacheCity=item.items;
                        this.cityData.forEach((list) =>{
                            if(list.code==this.defaultData.region_city_id){
                                this.currCityData=list
                            }
                        })
                    }
                });
                this.curr.currTerm=temp.current_term;
                this.curr.currCity = this.currCityData.name;
                this.params.region_id = this.currCityData.code;
            },
            showCity() {
                this.showLevelTem = false;
                this.tabsNum=1;
                this.cityData=this.cacheCity;
                if(this.cachePro!=''){
                    this.currProviceData=this.cachePro;
                }
                this.showCityTem = this.showCityTem ? false : true
            },
            showLevel(e) {
                this.showCityTem = false;
                this.showLevelTem = this.showLevelTem ? false : true
            },
            handleClose(e) {
               return
            },
            init: async function (type) {
                if(cacheData.isInit){
                   return;
                }else{
                    cacheData.isInit=true;
                    await this.loadAreaData();
                    await this.loadConfig();
                }
            }
        },
        created() {
            Bus.cityTem = this;
            document.addEventListener('click', () => {
                if(this.showLevelTem){
                    this.showLevelTem=false
                }
                if (this.showCityTem){
                    this.showCityTem=false
                }
            }, false)
        }
    }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped >
    .clearfix:after{
        display: block;
        clear: both;
        content: "";
        visibility: hidden;
        height: 0;
    }
    .top{
        border: 1px solid #d6dee3;
        min-height: 36px;
        background: #FFFFFF;
        padding:5px 0 0 20px;
    .filterList{
        font-size: 12px;
        color: #555555;
        margin-bottom: 5px;
    p{
        float: left;
        margin-right: 10px;
        position: relative;
    .cityWarp{
        position: absolute;
        width: 400px;
        border: 1px solid #DBE6EE;
        background: #FFFFFF;
        box-shadow:0px 1px 12px -6px #555555;
        z-index: 10;
        left: 0;
        top:25px;
    }
    .leveWarp{
        width: 120px;
        position: absolute;
        left: 0;
        top:25px;
        background: #FFFFFF;
        box-shadow:0px 1px 12px -6px #555555;
        border: 1px solid #DBE6EE;
        z-index:10;
    li{
        line-height: 40px;
        font-size: 14px;
        color: #555555;
        padding-left: 9px;
        position: relative;
    &:hover{
         background: #f8f8f8;
     }
    }
    .active{
        color:#159CFC;
    span{
        position: absolute;
        width: 12px;
        height: 8px;
        top: 50%;
        right: 18px;
        margin-top: -4px;
        background: url(../../assets/img/teacher/list-select-logo.png)
    }
    }
    }
    }
    .sourceLabel{
        float: left;
    p{
        margin-right: 30px;
        cursor: pointer;
    }
    .labelList{
        cursor: default;
    span{
        cursor: pointer;
        margin-right: 25px;
    &:hover{
         color: #159CFC;
     }
    }
    .active{
        color:#159CFC;
    }
    }
    }
    }
    }
    .tab{
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-bottom: 1px solid #DBE6EE;
    span{
        font-size: 14px;
        display: inline-block;
        line-height: 37px;
    &:first-child{
         margin-right: 80px;
     }
    }
    .activeTab{
        color: #159CFC;
        border-bottom: 2px solid #159CFC;
    }
    }
    .content{
        padding:10px 0 10px 10px;
        overflow: hidden;
    .contentWarp{
    .item{
        float: left;
        width: 95px;
        margin-bottom: 10px;
    a{
        float: left;
        padding: 0 10px;
        font-size: 14px;
        color: #555555;
    &:hover{
         background: #F8F8F8;
     }
    }
    }
    .curr{
    a{
        color: #159CFC;
    }
    }
    }
    }
</style>
