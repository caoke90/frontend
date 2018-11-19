<template>
  <div>
    <div class="selectBar">
      <div class="banner">
        <div class="banner-wrap clearfix">
          <p class="br" @click="selectBtn('point')" :class="{active: select == 'point', notEmpty: curSelectKps.length>0}">
            <span>知识点<span v-if="curSelectKps.length">({{curSelectKps.length}})</span></span>
            <i></i>
          </p>
          <p class="br" @click="selectBtn('type')" :class="{active: select =='type', notEmpty: curSelectsubtypes.length>0}">
            <span>题型</span>
            <i></i>
          </p>
          <div class="switch">
            <label>
              <span class="mui-switch" :class="{isFilter: isFilter}"  @click="filter_swith(this)"></span>
            </label>
            过滤已使用
          </div>
        </div>
      </div>
      <div class="content" v-if="select">
        <div class="item" v-if="select == 'point'">
          <div class="pointItem-wrap">
            <ul class="clearfix">
              <li v-for="(item, key) in pointList" @click="selectPoint(item)" :key="key">
                <label><input type="checkbox" :checked="findPoint(curSelectKps,item)>-1"></label>
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
              <li v-for="(item, key) in typeList" @click="selectType(item)" :key="key">
                <label>
                  <input type="checkbox" :checked="findType(curSelectsubtypes,item)>-1">
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
  import ajax from '@/api/ajax.js'

  export default {
    name: 'tcSelectBar',
    data: function(){
      return {
        select: '',
        isFilter: false,
        info:{},
        pointList: [],
        typeList: [],
        tabType: {
          point: '知识点',
          type: '题型'
        },
        cacheSelectKps:[],
        curSelectKps:[],
        cacheSelectsubtypes:[],
        curSelectsubtypes:[],
        params:{
          filtername:'',
          kps:[],
          content_sub_type_ids:[],
        },
      }
    },
    methods: {
      // 查找知识点
      findPoint:function(arr,item){
        for(let i=0;i<arr.length;i++){
          if(arr[i].id==item.id){
            return i;
          }
        }
        return -1;
      },
      // 查找题型
      findType:function(arr,item){
        for(let i=0;i<arr.length;i++){
          if(arr[i].nid==item.nid){
            return i;
          }
        }
        return -1;
      },
      // 选择知识点
      selectPoint: function(item){
        const index=this.findPoint(this.curSelectKps,item)
        if(index==-1){
          this.curSelectKps.push(item)
        }else{
          this.curSelectKps.splice(index,1)
        }
      },
      // 选择题型
      selectType: function (item) {
        const index=this.findType(this.curSelectsubtypes,item)
        if(index==-1){
          this.curSelectsubtypes.push(item)
        }else{
          this.curSelectsubtypes.splice(index,1)
        }
      },
      selectBtn: function (select) {
        if (this.select === select) {
          this.select = ''
        } else {
          this.select = select
        }
        // this.typeList = JSON.parse(JSON.stringify(this.typeList))
      },
      // 重置
      reset: function (selecttype) {
        this.curSelectKps=[]
        this.cacheSelectKps=[]
        this.cacheSelectsubtypes=[]
        this.curSelectsubtypes=[]
        // this.select=''
        this.$emit('nextInit')
      },
      // 确定
      confirm: function (seletedtype) {
        this.select='';
        this.setParams()
        this.$emit('nextInit')
      },
      // 设置参数
      setParams:function(){
        this.params.kps=[]
        this.curSelectKps.forEach((item)=>{
          this.params.kps.push(item.id)
        })
        this.params.content_sub_type_ids = [];
        this.curSelectsubtypes.forEach((item)=>{
          this.params.content_sub_type_ids.push(item.nid)
        })
        // 缓存选择
        this.cacheSelectKps=[].concat(this.curSelectKps)
        this.cacheSelectsubtypes=[].concat(this.curSelectsubtypes)
      },
      filter_swith: function () {
        if(!this.isFilter){
          this.select = ''
        }
        this.isFilter = !this.isFilter
        this.$emit('nextInit')
      },
      init:async function(params){
        this.select='';
        this.isFilter=false;
        this.cacheSelectKps=[]
        this.curSelectKps=[]
        this.cacheSelectsubtypes=[]
        this.curSelectsubtypes=[]
        Object.assign(this.params,params)
        let { bk_id, bkc_id, package_id,  package_type, unit_id, group_id, date, question_ids, package_name,} = params
        let resp
        if(package_type == 'HIGH_FREQUENCY'){
          resp=await ajax.post('/pc/v1/assign/lessonWrongContent', {
            group_id,
            date,
            bkc_id,
            package_type,
            page: 1,
            page_size: 10
          })
        }else if( package_type == 'REVIEW_VOCAB' || package_type == 'REVIEW_GRAMMAR' || package_type == 'REVIEW_READ' || package_type == 'REVIEW_LISTENING'){
          resp = await ajax.post('/pc/v1/assign/getBigdataPackageContent', {
            question_ids: JSON.stringify(question_ids),
            bk_id,
            bkc_id,
            unit_id,
            package_name,
            package_type,
          })
        }else {
          resp=await ajax.post('/pc/v1/assign/loadPackageContent', {
            bk_id,
            bkc_id,
            unit_id,
            package_type,
            id: package_id
          })
        }
        this.info=resp.data.data
        if(!(package_type == 'HIGH_FREQUENCY'|| package_type == 'REVIEW_VOCAB' || package_type == 'REVIEW_GRAMMAR' || package_type == 'REVIEW_READ' || package_type == 'REVIEW_LISTENING')){
          // 知识点
          if(this.info.knowledge_points_list && this.info.knowledge_points_list.length>0){
            this.pointList=this.info.knowledge_points_list
            this.params.filtername='wordId'
          }else{
            this.pointList=this.info.words
            this.params.filtername='questionType2Id'
          }
          // 题型
          this.typeList=this.info.content_types
          this.setParams()
        }
       
      }
    },
    created: function (){
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
        p.notEmpty{
          span{
            color: #159CFC;
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
