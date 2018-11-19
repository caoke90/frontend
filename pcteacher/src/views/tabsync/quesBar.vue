<template>
  <div>
    <div class="selectBar">
      <div class="banner">
        <div class="banner-wrap clearfix">
          <p @click.stop="selectBtn('word')" :class="{active: select === 'word', blue: true}">{{curSelectWord.name}}<i :class="{cur: select == 'word'}"></i></p>
          <p @click.stop="selectBtn('point')" :class="{active: select === 'point'}"><span :class="ishaspoint ?'blue':''">知识点<span v-if="cacheSelectKps.length">({{cacheSelectKps.length}})</span></span><i :class="{cur: select == 'point'}"></i></p>
          <p @click.stop="selectBtn('type')" :class="{active: select === 'type'}"><span :class="ishastype?'blue':''">题型</span><i :class="{cur: select == 'type'}"></i></p>
          <div class="switch">
            <label>
              <span class="mui-switch" :class="{isFilter: isFilter}" @click.stop="filter_swith(this)"></span>
            </label>
            过滤已使用
          </div>
        </div>
      </div>
      <div class="content" :class='{word: select === "word"}' v-if="select">
        <div class="item" v-if="select == 'word'">
          <div class="word-wrap">
            <ul class="clearfix" v-if="listData.length">
              <li v-for="(item, key) in listData" :class="{active: curSelectWord === item}" @click.stop="selectWord(item)">
                {{item.name}}
                <i></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="item" v-if="select == 'point'">
          <div class="pointItem-wrap">
            <ul class="clearfix" v-if="words.length">
              <li v-for="(item, index) in words">
                <label><input type="checkbox" :checked="findType(curSelectKps,item)>-1" @click.stop="selectKp(item)"></label>
                {{item.name}}
              </li>
            </ul>
            <div class="btnItem">
              <div class="btn clear cancelBtn" @click.stop="reset(select)">重置</div>
              <div class="btn ok" @click.stop="confirm('point')">确定</div>
            </div>
          </div>
        </div>
        <div class="item" v-if="select == 'type'">
          <div class="pointItem-wrap">
            <ul class="clearfix" v-if="subtypes.length">
              <li v-for="(item, index) in subtypes">
                <label><input type="checkbox" :checked="findType(curSelectsubtypes,item)>-1" @click.stop="selectSub(item)"></label>
                {{item.name}}
              </li>
            </ul>
            <div class="btnItem">
              <div class="btn clear cancelBtn" @click.stop="reset('type')">重置</div>
              <div class="btn ok" @click.stop="confirm('type')">确定</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Bus from '@/marvel/bus'
  import {sendLog} from '@/common/js/logger';
  import ajax from '../../api/ajax';
  export default {
    name: 'selectBar',
    data: function(){
      return {
        select: '',
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
        if(this.curSelectKps.length>0){
          has=true;
        }
        return has;
      },
      ishastype:function () {
        var has=false;
        if(this.curSelectsubtypes.length>0){
          has=true;
        }
        return has;
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
      selectBtn: function (select) {
        if (this.select === select) {
          this.select = ''
          this.cancel()
        } else {
          this.select = select;
        }
        // 打点
        const map={
          'word':'vocabulary',
          'point':'knowledge',
          'type':'type',
        }
        // sendLog(log.module.m_homework,log.op.tk_select_click,{s0:'english',s1:map[select]})
      },
      filter_swith:function(){
        this.select = '';
        this.isFilter=!this.isFilter
        let status = this.isFilter ? 'filter' : 'nofilter'
        // sendLog(log.module.m_homework,log.op.tk_select_click,{s0:'english',s1:status})
        this.$emit('nextInit')
      },
      cancel:function(){
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
        this.select=''
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
        // console.log(this.curSelectsubtypes)
      },
      // 重置
      reset: function (selecttype) {
        this.curSelectKps=[]
        this.cacheSelectKps=[]
        this.cacheSelectsubtypes=[]
        this.curSelectsubtypes=[]
        // this.select = ''
        //this.$emit('nextInit')
      },
      // 确认
      confirm: function (seletedtype) {

        this.select=''
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
        // if(this.params.content_sub_type_ids.length===0){
        //   delete this.params.content_sub_type_ids;
        // }
        // 缓存选择
        this.cacheSelectKps=[].concat(this.curSelectKps)
        this.cacheSelectsubtypes=[].concat(this.curSelectsubtypes)
      },
      // 初始化
      init:async function (params) {
        
        this.select='';

        Object.assign(this.params,params)
        const resp=await ajax.post('/pc/v1/assign/questionBankSearchCondition',{
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
    created: function (){
        // document.addEventListener('click', () => {
        //     if(this.select){
        //       this.select='';
        //     }
        // }, false)
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
          span.blue{
            color: #159CFC;
          }
            &:hover{
                background: #FFFFFF;
             }
          i{
            background: url(../../assets/img/tri_normal.png) no-repeat;
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
            background: url(../../assets/img/up_selected.png) no-repeat;
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
              background: url(../../assets/img/teacher/list-select-logo.png);
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
            color: #159CFC;
            i{
              position: absolute;
              width: 12px;
              height: 8px;
              top: 50%;
              right: 18px;
              margin-top: -6px;
              background: url(../../assets/img/teacher/list-select-logo.png)
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
