<template>
  <div class="select" v-show="isShow">
    <div class="select-content">
      <ul>
        <li v-for="(item, index) in materialData" :class="{'active': num===index}" @click.stop="select(item, index)">
          {{item.name || item.alias}}
          <span></span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import Bus from '@/marvel/bus'

  export default {
    name: 'schapter',
    data: function (){
      return {
        materialData: [],
        isShow: false,
        currentSelect: null,
        num: 0
      }
    },
    methods:{
      show:function(){
        this.isShow=true
      },
      hide:function () {
        this.isShow=false;
      },
      select: function(item, index){
        this.hide()
        if(item===this.currentSelect){return}
        this.num = index
        this.currentSelect = item
        this.$emit('selectItem',item)
      },
      init: function (params){
        this.num = 0
        this.materialData = params
        params.forEach((item, index)=>{
          if(item.select){
            this.currentSelect = params[index]
            this.num = index
          }
        })
        if(!this.currentSelect){
          this.currentSelect = params[0]
        }
        // this.$nextTick(()=>{
        //   if(!this.currentSelect){
        //     this.currentSelect = params[0]
        //   }
        // })
      }
    },
    created() {

    },
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
    top:20px;
    left: 0;

    &-content{
      max-height: 300px;
      overflow:hidden;
      ul{
          max-height:300px;
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
          padding: 11px 43px 11px 11px;
          line-height: 21px;
          font-size: 14px;
          color: #555555;
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
