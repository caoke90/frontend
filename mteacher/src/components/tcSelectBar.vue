<template>
  <div class="card" v-if="isWordPage">
    <div class="selectBar">
      <div class="banner" @touchmove.stop.prevent>
        <div class="banner-wrap">
          <template v-for="(item,key) in tabType">
            <p @click="selectBtn(key)">
              <span :class="key === 'point'?pointSelect:typeSelect">{{item}}</span>
              <i :class="{cur: select === key}"></i>
            </p>
          </template>
          <div class="switch">
            过滤已使用
            <label><input class="mui-switch" type="checkbox" v-on:click="filter_swith(this)"></label>
          </div>
        </div>
      </div>
      <div class="content">
        <!--选择单词-->
        <div class="item pointItem animated" :class="{'slideInDown' : select == 'point', 'slideInUp' : select == ''}" v-show="select == 'point'">
          <div v-if="pointList.length">
            <div class="pointItem-wrap" @touchmove.stopPropagation>
              <div class="litop">选择知识点（可多选）</div>
              <div class="licont">
                <div class="span" v-for="(item,key) in pointList" :class="{'cur' : item.select}" @click="selectPoint(key)" :key="key">{{item.name}}</div>
              </div>
            </div>
            <div class="btnItem" @touchmove.stopPropagation>
              <div @click="reset(select)" v-press:active class="btn clear cancelBtn">重置</div>
              <div @click="confirm('point')" v-press:active class="btn ok">确定</div>
            </div>
          </div>
          <div class="item" v-else>
            <div style="height: 5.18rem;"><Msg :card="{type:'empty', msg: '暂无满足条件的知识点', noshowimg:true}"></Msg></div>
          </div>
        </div>

        <!--选择小题型-->
        <div class="item pointItem animated" :class="{'slideInDown' : select == 'type', 'slideInUp' : select == ''}" v-if="select == 'type' ">
          <div v-if="typeList.length">
            <div class="pointItem-wrap">
              <div class="litop">选择题型（可多选）</div>
              <div class="typeItemlicont">
                <div class="span" v-for="(item,i) in typeList" :class="{'cur' : item.select}" @click="selectType(i)" :key="i">{{item.name}}</div>
              </div>
            </div>
            <div class="btnItem">
              <div @click="reset(select)" v-press:active class="btn clear cancelBtn">重置</div>
              <div @click="confirm('type')" v-press:active class="btn ok">确定</div>
            </div>
          </div>
          <div class="item" v-else>
            <div style="height: 5.18rem;"><Msg :card="{type:'empty', msg: '暂无筛选条件', noshowimg:true}"></Msg></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mark" v-show="select" @touchmove.stop.prevent @click="cancel"></div>
  </div>
</template>

<script>
  //引入通信总线
  import {bodyNoScroll} from '../utils/bodyNoScroll.js';
  import Bus from '../marvel/bus';
  import log from '../common/js/utils/logConfig';
  import {sendLog} from '../common/js/logger';
  import {getInitParams} from "../common/js/external/index";
  import Msg from "./cards/msg";

  export default {
    components: {Msg},
    data: function () {
      return {
        select: '',
        isFilter: false,
        isWordPage:false,
        isPointConfirm:false,
        isTypeConfirm:false,
        tabType: {
          point: '知识点',
          type: '题型'
        },
        pointselectArr:[],
        typeselectArr:[],
        pointList: [],
        typeList: [],
        params:1,
        screenType:''
      }
    },
    props: {},
    name: 'selectBar',
    computed: {
      pointSelect:function () {

        let pointselect = this.pointList.some(function (point) {
           return point.select && this.isPointConfirm;
        }.bind(this));

        return pointselect?"bluecur":"";
      },
      typeSelect:function () {
        let typeselect = this.typeList.some(function (type) {
          return type.select && this.isTypeConfirm;
        }.bind(this));

        return typeselect?"bluecur":"";
      }
    },
    watch:{
      select:function (val) {
        if(val){
          bodyNoScroll(true)
        }else{
          bodyNoScroll(false)
        }
      }
    },
    methods: {
      cancel:function(){
        this.select = '';
        this.pointList.forEach((item,i)=>{
          item.select=this.pointselectArr[i]
        })
        this.typeList.forEach((item,i)=>{
          item.select=this.typeselectArr[i]
        })
      },
      selectBtn: function (select) {

        let clickTab;
        if (select == 'point') {
          clickTab = 'knowledge'
        } else if (select == 'type') {
          clickTab = 'type'
        }
        if (this.select === select) {
          this.select = '';
          this.pointList.forEach((item,i)=>{
            item.select=this.pointselectArr[i]
          })
          this.typeList.forEach((item,i)=>{
            item.select=this.typeselectArr[i]
          })
        } else {
          this.select = select;
        }
        sendLog(log.module.m_homework,log.op.tb_select_click,{s0:'english',s1:clickTab})
      },

      selectPoint: function (i) {
        this.pointList[i].select = !this.pointList[i].select;
      },
      selectType: function (i) {
        this.typeList[i].select = !this.typeList[i].select;
      },
      reset: function (selecttype) {
          this.clear_slect(this.typeList);
          this.clear_slect(this.pointList);
          console.log("清除typeList&pointList");
          this.confirm('cancel');
      },
      confirm: function (seletedtype) {
        let vm = this;
        vm.select = '';
        if(seletedtype == 'type'){
          vm.isTypeConfirm = true;
        }else if(seletedtype == 'point'){
          vm.isPointConfirm = true;
        }else if(seletedtype == 'cancel'){
          vm.isTypeConfirm = false;
          vm.isPointConfirm = false;
        }
        this.send_filter();
      },
      clear_slect: function (obj) {
        for (let item in obj) {
          obj[item].select = false
        }
      },
      filter_swith: function () {
        if(!this.isFilter){
          this.select = '';
        }
        this.isFilter = !this.isFilter;
        this.send_filter();
        let status = this.isFilter ? 'filter' : 'nofilter';
        if (status == "filter") {
          let params = getInitParams();
          if (params.package_type === 1) {
            this.screenType = '单词跟读题包';
          } else if (params.package_type===5) {
            this.screenType = '词汇识记题包';
          }
          sendLog("", "", {
            event: "onlineEn_filterFunction",
            logData: { platformType: "H5", filterFunction: '过滤已使用', modelName: '教材同步',screenType: this.screenType}
          })
        }
        sendLog(log.module.m_homework,log.op.tk_select_click,{s0:'english',s1:status})
      },
      send_filter: function(){
        //缓存之前的
        this.pointList.forEach( (item,i) =>{
          this.pointselectArr[i]=item.select
        });
        this.typeList.forEach( (item,i) =>{
          this.typeselectArr[i]=item.select
        });
        let vm = this, pointList=[], typeList=[];
        vm.pointList.forEach((item)=>{
          if(item.select){
            pointList.push(item.id);
          }
        });
        vm.typeList.forEach((item)=>{
          if(item.select){
            typeList.push(item.nid);
          }
        });
        Bus.$emit('transferSelectData',{
          pointList,
          typeList,
          isFilter: vm.isFilter
        });
      }
    },
    created: function () {
      let vm = this;
      Bus.tagBar=this;
      Bus.$on('transferBarData', function(data){

        vm.pointList = data.words;
        vm.typeList = data.content_types;
        vm.pointList.forEach( (item,i) =>{
          vm.pointselectArr[i]=item.select
        });
        vm.typeList.forEach( (item,i) =>{
          vm.typeselectArr[i]=item.select
        });
      });


    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  @import "@/common/scss/animate.scss";
  .card{
    width: 7.5rem;
    margin: 0 auto;
    height: 0;
  }
  .selectBar{
    position: fixed;
    top: 0;
    left:0;
    width: 7.5rem;
    font-size: .28rem;
    background-color: #fff;
    z-index: 99;
    .banner{
      height: 1rem;
      position: relative;
      &-wrap{
        display: flex;
      }
      &:after{
        content: '';
        height: 0.02rem;
        background: #E5E5E5;
        width: 7.5rem;
        position: absolute;
        left: 0;
        bottom: 0;
        transform:scaleY(.5);
      }
      p{
        line-height: 1rem;
        color: #58595E;
        flex: 1;
        &:first-child{
          padding-left: .4rem;
          text-align: left;
        }
        i{
          display: inline-block;
          width: 0.16rem;
          height: 0.08rem;
          margin: 0 0 0.06rem 0.12rem;
          background: url('../assets/img/arrow_down.png') no-repeat;
          background-size: 100% 100%;
        }
        .cur{
          background: url('../assets/img/arrow_up.png') no-repeat;
          background-size: 100% 100%;
        }
        .bluecur {
          color: #007AFF;
        }
      }
      .switch{
        line-height: 1rem;
        float: right;
        padding-right: .42rem;
        color: #58595E;
        .mui-switch {
          width: 0.76rem;
          height: 0.44rem;
          position: relative;
          left: 0.06rem;
          top: 0.1rem;
          border: 1px solid #dfdfdf;
          background-color: #fdfdfd;
          box-shadow: #dfdfdf 0 0 0 0 inset;
          border-radius: 0.4rem;
          background-clip: content-box;
          display: inline-block;
          -webkit-appearance: none;
          user-select: none;
          outline: none;
          &:before {
            content: '';
            width: 0.4rem;
            height: 0.4rem;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 0.4rem;
            background-color: #fff;
            box-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.4);
          }
          &:checked {
            border-color: #007AFF;
            box-shadow: #007AFF 0 0 0 16px inset;
            background-color: #007AFF;
            &:before {
              left:0.32rem;
            }
          }
        }
      }
    }
    .content{
      max-height: 6.05rem;
      overflow-y: scroll;
      background-color: rgba(0, 0, 0, 0.7);
      .wordItem{
        .li{
          position: relative;
          padding-left: .4rem;
          font-size: .28rem;
          line-height: 1rem;
          color: #333333;
          &:after{
            content: '';
            height: 0.02rem;
            background: #EEEEEE;
            width: 7.1rem;
            position: absolute;
            right: 0;
            bottom: 0;
            transform:scaleY(.5);
          }
        }
        .cur{
          color: #007AFF;
          background: rgba(0,0,0,0.05);
          &:before{
            content: '';
            position: absolute;
            right: 0.4rem;
            top: .3rem;
            width: .48rem;
            height: .48rem;
            background: url('../assets/img/que-selected.png') no-repeat;
            background-size: contain;
          }
        }
      }

      .pointItem{
        position: relative;
        max-height: 6.05rem;
        overflow-y: hidden;
        background: #fff;
        &-wrap{
          position: relative;
          max-height: 6.05rem;
          padding:0.32rem 0.3rem 0.4rem;
          overflow-y: scroll;
          &:before{
            /*content: '';*/
            /*position: absolute;*/
            /*left: 0;*/
            /*top: .3rem;*/
            /*width: .08rem;*/
            /*height: .4rem;*/
            /*background-color: #007AFF;*/
          }
        }
        .litop{
          line-height: 0.4rem;
          margin-bottom: 0.32rem;
          color: #58595E;
          font-size: 0.28rem;
        }
        .licont{
          height: auto;
          margin-bottom: 1rem;
          .span{
            display: inline-block;
            height: .59rem;
            line-height: .59rem;
            margin: 0 .2rem .3rem 0;
            padding: 0 .3rem;
            text-align: center;
            font-size: .24rem;
            color: #58595E;
            background: #F5F6F8;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 100%;
            box-sizing: border-box;
            border: 1px solid #ffffff;
            border-radius: 0.08rem;
          }
          .cur{
            background-color: #F2F8FF;
            color: #007AFF;
            border: 1px solid #007AFF;
          }
        }
        .btnItem{
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1.2rem;
          width: 7.5rem;
          padding: .2rem 0.4rem;
          border-top: 1px solid #EEEEEE;
          background: #fff;
          .btn{
            color: #58595E;
            background-color: #F5F6F8;
            width: 3.2rem;
            height: .8rem;
            line-height: .8rem;
            text-align: center;
            font-size: .32rem;
            border-radius: 1rem;
          }
          .btn.clear{
            float: left;
          }
          .btn.ok{
            float: right;
            background: #007AFF;
            color: #fff;
          }
          .cancelBtn{
            color:#58595E;
          }
          .btn.active{
            color: #FFFFFF;
            background: #005BBF;
          }
          .cancelBtn.active{
            color:#58595E;
            background: #E8E9EB;
          }
        }
      }
      .typeItemlicont{
        height: auto;
        margin-bottom: 1rem;
        .span{
          display: inline-block;
          height: .59rem;
          line-height: .59rem;
          width: 3.2rem;
          text-align: center;
          font-size: .24rem;
          color: #58595E;
          background: #F5F6F8;
          margin-bottom: 0.3rem;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 100%;
          box-sizing: border-box;
          border: 1px solid #ffffff;
          border-radius: 0.08rem;
        }
        .span:nth-child(odd){
          margin-right: 0.3rem;
        }
        .cur{
          background-color: #F2F8FF;
          color: #007AFF;
          border: 1px solid #007AFF;
        }
      }

    }
  }
  .mark{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: rgba(0,0,0,.7);
  }
</style>
