<template>
  <div class="card" >
    <div class="selectBar" >
      <div class="banner"  v-if="curSelectWord.name">
        <p @click="selectBtn('word')">{{curSelectWord.name}}<i :class="{cur: toggleSelect == 'word'}"></i></p>
        <p @click="selectBtn('point')"><span :class="ishaspoint?'blue':''">知识点</span><i :class="{cur: toggleSelect == 'point'}"></i></p>
        <p @click="selectBtn('type')"><span :class="ishastype?'blue':''">题型</span><i :class="{cur: toggleSelect == 'type'}"></i></p>
        <div class="switch">
          过滤已使用
          <label><input class="mui-switch" @click="filter_swith" :checked="isFilter" type="checkbox"></label>
        </div>
      </div>
      <div class="content">
        <div ref="content">
          <div class="item wordItem animated" :class="{'slideInDown' : toggleSelect == 'word'}" v-show="toggleSelect == 'word'">
            <div v-if="listData.length">
              <div class="li" v-press:active v-for="(item,key) in listData" :class="{'cur' : curSelectWord === item}" @click="selectWord(item)" :key="key">{{item.name}}</div>
            </div>
            <div class="item" v-else>
              <div style="height: 5.18rem;"><Msg :card="{type:'empty', msg: '暂无满足条件的选项' , noshowimg:true}"></Msg></div>
            </div>
          </div>
          <div class="item pointItem animated" :class="{'slideInDown' : toggleSelect == 'point'}" v-show="toggleSelect == 'point'">
            <div v-if="listData.length">
              <div class="pointItem-wrap">
                <div class="litop">选择{{curSelectWord.name}}（可多选）</div>
                <div :class="curSelectWord.name=='句型'?'typeItemlicont':'licont'">
                  <div class="span" v-for="(item,key) in words" :key="key" :class="{'cur' : findType(curSelectKps,item)>-1}" @click="selectKp(item)">{{item.name}}</div>
                </div>
              </div>
              <div class="btnItem">
                <div @click="reset('point')" v-press:active class="btn clear cancelBtn">重置</div>
                <div @click="confirm('point')" v-press:active class="btn ok">确定</div>
              </div>
            </div>
            <div class="item" v-else>
              <div style="height: 5.18rem;"><Msg :card="{type:'empty', msg: '暂无满足条件的知识点'}"></Msg></div>
            </div>
          </div>
          <template  v-if="toggleSelect == 'type'">
            <div class="item pointItem animated" :class="{'slideInDown' : toggleSelect == 'type'}">
              <div v-if="subtypes.length">
                <div class="pointItem-wrap">
                  <div class="litop">选择{{curSelectWord.name}}（可多选）</div>
                  <div class="typeItemlicont">
                    <div class="span" v-for="(item,key) in subtypes" :class="{'cur' : findType(curSelectsubtypes,item)>-1}" @click="selectSub(item)">{{item.name}}</div>
                  </div>
                </div>
                <div class="btnItem">
                  <div @click="reset('type')" v-press:active class="btn clear cancelBtn">重置</div>
                  <div @click="confirm('type')" v-press:active class="btn ok">确定</div>
                </div>
              </div>
              <div class="item" v-else>
                <div style="height: 5.18rem;"><Msg :card="{type:'empty', msg: '暂无筛选条件' , noshowimg:true}"></Msg></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="mark" v-show="toggleSelect" @touchmove.stop.prevent @click="cancel"></div>
  </div>
</template>
<script>

  import {bodyNoScroll} from '../utils/bodyNoScroll.js';
  import Bus from '../marvel/bus';
  import ajax from '../api/ajax';
  import Msg from "./cards/msg";
  import log from '../common/js/utils/logConfig';
  import {sendLog} from '../common/js/logger';
  export default {
    components: {Msg},
    data: function () {
      return {
        isFilter:false,
        toggleSelect:'',
        curSelectWord:{
          "model":"REVIEW_GRAMMAR",
          "name":"语法",
          "kps":[]
        },
        cacheSelectKps:[],
        curSelectKps:[],
        cacheSelectsubtypes:[],
        curSelectsubtypes:[],
        listData:[],
        params:{},
      }
    },
    name: 'selectBar',
    computed: {
      // 展示的可选知识点
      words:function(){

        if(this.curSelectsubtypes.length==0){
          return this.curSelectWord.kps;
        }
        const list=[]
        const cache=[]
        this.curSelectsubtypes.forEach( (item)=> {
          this.curSelectWord.kps.forEach((item2)=>{
            if(this.findType(item2.subtypes,item)>-1){
              if(cache.indexOf(item2.id)==-1){
                cache.push(item2.id)
                list.push(item2)
              }

            }
          })
        })
        return list;
      },
      // 展示的可选题型
      subtypes:function(){
        const arr=[]
        const cache=[]
        let selectKps=this.curSelectWord.kps
        if(this.curSelectKps.length>0){
          selectKps=this.curSelectKps;
        }
        selectKps.forEach( (kp)=> {
          kp.subtypes.forEach((sub)=>{
            if(cache.indexOf(sub.id)==-1){
              cache.push(sub.id)
              arr.push(sub)
            }
          })
        })
        return arr;
      },
      ishaspoint:function () {
        var has=false;
        if(this.cacheSelectKps.length>0){
           has=true;
        }
        return has;
      },
      ishastype:function () {
        var has=false;
        if(this.cacheSelectsubtypes.length>0){
          has=true;
        }
        return has;
      }
    },
    watch:{
      toggleSelect:function (val) {
        if(val){
          bodyNoScroll(true)
        }else{
          bodyNoScroll(false)
        }
      }
    },
    methods: {

      // 找到题型
      findType:function(arr,item){
        for(let i=0;i<arr.length;i++){
          if(arr[i].id==item.id){
            return i;
          }
        }
        return -1;
      },
      // 选择
      selectBtn: function (toggleSelect) {
        if (this.toggleSelect === toggleSelect) {
          this.cancel()
        } else {
          this.toggleSelect = toggleSelect;
        }
        // 打点
        const map={
          'word':'vocabulary',
          'point':'knowledge',
          'type':'type',
        }
        sendLog(log.module.m_homework,log.op.tk_select_click,{s0:'english',s1:map[toggleSelect]})
      },
      filter_swith:function(){
        this.toggleSelect = '';
        this.isFilter=!this.isFilter
        let status = this.isFilter ? 'filter' : 'nofilter'
        sendLog(log.module.m_homework,log.op.tk_select_click,{s0:'english',s1:status})
        this.$emit('filter')
      },
      cancel:function(){
        this.toggleSelect = ''
        this.curSelectKps=[].concat(this.cacheSelectKps)
        this.curSelectsubtypes=[].concat(this.cacheSelectsubtypes)
      },
      // 选中词汇
      selectWord: function (item) {

        this.curSelectWord=item
        this.cacheSelectKps=[]
        this.cacheSelectsubtypes=[]
        this.curSelectKps=[]
        this.curSelectsubtypes=[]
        this.toggleSelect=''
        this.setParams()
        this.$emit('nextInit')
      },
      // 选中知识点
      selectKp:function(item){
        const index=this.findType(this.curSelectKps,item)
        if(index==-1){
          this.curSelectKps.push(item)
        }else{
          this.curSelectKps.splice(index,1)
        }
      },
      // 选中题型
      selectSub:function(item){
        const index=this.findType(this.curSelectsubtypes,item)
        if(index==-1){
          this.curSelectsubtypes.push(item)
        }else{
          this.curSelectsubtypes.splice(index,1)
        }
        console.log(this.curSelectsubtypes)
      },
      // 重置
      reset: function (selecttype) {
        this.curSelectKps=[]
        this.cacheSelectKps=[]
        this.cacheSelectsubtypes=[]
        this.curSelectsubtypes=[]
        this.toggleSelect = ''
        this.setParams()
        this.$emit('nextInit')
      },
      // 确认
      confirm: function (seletedtype) {

        this.toggleSelect=''
        this.setParams()
        this.$emit('nextInit')
      },
      // 设置请求删选后题目的参数
      setParams:function () {
        //设置默认参数
        this.params.algo_type = this.curSelectWord.model;
        // 知识点
        let cache1=[];
        this.curSelectKps.forEach((type)=>{
          // 如果存在显示范围
          if(this.findType(this.words,type)>-1){
            cache1.push(type)
          }
        })
        this.curSelectKps=cache1
        let kpsArr=[];
        let selectkps;
        if(this.curSelectKps.length>0){
          selectkps=this.curSelectKps
        }else{
          selectkps=this.curSelectWord.kps
        }
        selectkps.forEach((kp)=>{
          if(kpsArr.indexOf(kp.id)==-1){
            kpsArr.push(kp.id);
          }
        })
        this.params.kps = kpsArr;
        if(this.params.kps.length===0){
          delete this.params.kps;
        }

        // 过滤题型
        let cache=[];
        this.curSelectsubtypes.forEach((type)=>{
          // 如果存在显示范围
          if(this.findType(this.subtypes,type)>-1){
            cache.push(type)
          }
        })
        this.curSelectsubtypes=cache
        const typesArr=[]
        this.curSelectsubtypes.forEach((type)=>{
          if(typesArr.indexOf(type.id)==-1){
            typesArr.push(type.id);
          }
        })
        this.params.content_sub_type_ids = typesArr;
        if(this.params.content_sub_type_ids.length===0){
          delete this.params.content_sub_type_ids;
        }
        // 缓存选择
        this.cacheSelectKps=[].concat(this.curSelectKps)
        this.cacheSelectsubtypes=[].concat(this.curSelectsubtypes)
      },
      // 初始化
      init:async function (params) {
        Object.assign(this.params,params)
        const resp=await ajax.post('/assign/questionBankSearchCondition',{
          unit_id:params.unit_id,
          class_level:params.class_level
        });
        const info=resp.data.data
        this.listData=[]

        const orderMap={
          REVIEW_VOCAB:1,
          REVIEW_SENTENCES:2,
          REVIEW_GRAMMAR:3,
          REVIEW_ORAL:4,
          REVIEW_LISTENING:5,
          REVIEW_READ:6,
        };
        for(var k in info){
          info[k].order=orderMap[info[k].model]
          this.listData.push(info[k])
        }
        this.listData.sort(function (p1,p2) {
          return p1.order-p2.order;
        })
        let selectIndex=0;
        this.listData.forEach((item,k)=>{
          if(item.model==this.params.package_type){
            selectIndex=k;
          }
        })
        if(this.listData[selectIndex]){
          this.curSelectWord=this.listData[selectIndex];
        }
        this.setParams()
        this.curSelectKps=[]
        this.curSelectsubtypes=[]
        this.cacheSelectKps=[]
        this.cacheSelectsubtypes=[]
      }
    },
    created: async function () {
      Bus.quesBar = this;
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
    left: 0;
    width: 7.5rem;
    font-size: .28rem;
    background-color: #fff;
    z-index: 99;
    overflow: hidden;
    .banner{
      height: 1rem;
      position: relative;
      display: flex;
      text-align: center;
      .blue{
        color: #007AFF;
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
        padding-left: .48rem;
        float: left;
        line-height: 1rem;
        color: #58595E;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        -webkit-line-clamp: 1;
        flex: 1;

        &:first-child{
          padding-left: .4rem;
          position: relative;
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
      }
      .switch{
        line-height: 1rem;
        float: right;
        padding-right: .42rem;
        color: #58595E;

        text-align: right;
        width: 2.8rem;
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
        background: #fff;
        .li{
          position: relative;
          padding-left: .4rem;
          font-size: .28rem;
          line-height: 1rem;
          color: #333333;
          font-family: PingFangSC-Regular;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 100%;
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
        .li.active{
          background: rgba(0,0,0,0.05);
        }
        .cur{
          color: #007AFF;
          &:before{
            content: '';
            position: absolute;
            right: 0.4rem;
            top: .2rem;
            width: .48rem;
            height: .48rem;
            background: url('../assets/img/que-selected.png') no-repeat;
            background-size: contain;
          }
        }
      }
      .item{
        background: #fff;
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
            // background-color: #007AFF;
          }
        }
        .litop{
          line-height: 0.4rem;
          margin-bottom: 0.32rem;
          font-size: 0.28rem;
          color: #58595E;
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
          font-family: SFUIDisplay-Regular;
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
          border-radius: 0.08rem;
          border: 1px solid #ffffff;
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
