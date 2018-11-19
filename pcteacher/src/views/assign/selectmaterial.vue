<template>
  <div class="select" v-show="isShow">
    <div class="select-tab">
      <ul>
        <li v-for="(item, index) in tabs" :class="{active: index==tabsNum}" @click.stop="changeTab(index)">
          <span>{{item}}</span>
        </li>
      </ul>
    </div>
    <div class="select-content">
      <ul v-if="tabsNum===0">
        <li v-for="(item, index) in versionData" :class="{active: item===currentVersion}" @click.stop="selectVersion(item)">{{item.name}}<span></span></li>
      </ul>
      <ul v-else>
        <li v-for="(item, index) in materialData" :class="{active: item===currentMaterial}" @click.stop="selectMaterial(item)">{{item.name}}<span></span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Bus from '@/marvel/bus'
  import ajax from '@/api/ajax'
  export default {

    data: function (){
      return {
        tabs: ['版本', '教材'],
        tabsNum: 1,
        isShow: false,
        versionData:[],
        materialData: [],
        cacheVersion: null,
        currentVersion: null,
        currentMaterial: {
          name: ''
        },
        params:{
          bk_id:'',
          parent_id: '',
          class_level:''
        },
      }
    },
    methods: {
      changeTab: function (index){
        this.tabsNum = index
      },
      // 选择版本
      selectVersion: function(item){
        this.tabsNum = 1
        if(item===this.currentVersion){return;}
        this.currentVersion=item;
        this.materialData = this.currentVersion.book_list
      },
      // 选择教材
      selectMaterial: function(item){
        // this.tabsNum = 0
        this.hide()
        if(item===this.currentMaterial){return}
        this.currentMaterial = item
        this.params.bk_id = item._id
        this.params.parent_id = item.parent_id
        this.params.class_level = item.clazz_level
        this.$emit('selectBook', item)
      },
      show:function () {
        this.isShow=true;
      },
      hide:function () {
        this.isShow=false;
      },
      setDefault: function (){
         if(this.versionData[0]){
          this.currentVersion = this.versionData[0];
          this.materialData = this.versionData[0].book_list
          if(this.materialData[0]){
            this.currentMaterial = this.materialData[0]
          }
        }
      },
      init: async function (params){
        this.params.bk_id = params.bk_id
        this.params.parent_id = params.parent_id
        this.params.class_level = params.clazz_level
        this.currentMaterial.name = params.name
        const resp = await ajax.post('/pc/v1/assign/loadBookTree')
        // 初始化 当前的版本、教材
        this.versionData=resp.data.data.list
        if(this.versionData.length){
          this.versionData.forEach((item, index)=>{
            if(params.parent_id === item._id){
              this.currentVersion = this.versionData[index]
              this.materialData = this.versionData[index].book_list
            }
          })
          if(this.materialData.length){
            this.materialData.forEach((item, index)=>{
              if(params.bk_id === item._id){
                this.currentMaterial = this.materialData[index]
              }
            })
          }
        }
        if(!params.bk_id && !params.parent_id){
          this.setDefault()
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .select{
    background: #FFFFFF;
    border: 1px solid #DBE6EE;
    box-shadow: 0 2px 4px 0 rgba(28,33,38,0.08);
    position: absolute;
    width: 280px;
    z-index: 100;
    max-height: 320px;
    top: 20px;
    left: 0;
    &-tab{
      border-bottom: 1px solid #EDF2F6;
      ul{
        display: flex;
        height: 39px;
        li{
          flex: 1;
          text-align: center;
          line-height: 37px;
          span{
            font-size: 14px;
            color: #555555;
            padding: 10px 0;
          }
        }
        li.active{
          span{
            border-bottom: 2px solid #159CFC;
            color: #159CFC;
          }
        }
      }
    }
    &-content{
      height: 278px;
      overflow: hidden;
      ul{
          width: 100%;
          height: 270px;
          overflow-y: scroll;
      &::-webkit-scrollbar {
            width:6px;
       }
       &::-webkit-scrollbar-thumb {
            background-color:#dddddd;
            background-clip:padding-box;
            min-height:9px;
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius:2em;
        }
        li{
          font-size: 14px;
          color: #555555;
          padding: 11px 43px 11px 11px;
          line-height: 21px;
        }
        li.active{
          color: #159CFC;
          background: #FFF!important;
          position: relative;
          cursor: default;
          span{
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
  }

</style>
