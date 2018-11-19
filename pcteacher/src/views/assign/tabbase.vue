<template>
  <div class="w-base">
    <div class="w-base-title assign-title">
      <div class="w-fl-left w-base-switch">
        <ul>
          <li v-for="item,k in tabs" :key="k" :class="{active:curItem===item}" @click="tabclick(item)">
            <a href="javascript:void(0);">
              <span class="h-arrow">
                <i class="w-icon-arrow w-icon-arrow-blue"></i>
              </span>{{item.name}}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import ajax from '../../api/ajax.js'
  import sa from '../../utils/sensorsdata'
  export default {
    name: 'tabbase',
    data () {
      return {
        tabs : [
          // {"name":"教材同步","key":"sync"},
         // {"name":"听说专区","key":"junior_review"},
          // {"name":"复习专区","key":"entrance_exam_review"},
          // {"name":"教辅选题","key":"workbook"},
          // {"name":"经典读物","key":"classic"}
          ],
        curItem:null,
      }
    },
    props:[],
    methods:{
      tabclick:async function (item) {
        sa.track('onlineEn_clickModule', {
          moduleName: item.name
        });
        if(this.curItem===item){return;}
        if(item.key=='sync'){
          this.curItem=item;
        }
        else if(item.key=='junior_review'){
            this.curItem=item;
        }
        this.$emit('tabclick',item)
      },
      init:async function (params) {
        const resp = await ajax.post('/pc/v1/assign/loadTabs')
        this.tabs = resp.data.data.tabs;
        //报错兼容
        if(!this.tabs){
          return;
        }
        this.tabs.forEach( (item) =>{
          if(item.key==params.tab){
            this.curItem=item;
          }
        })
        if(!this.curItem){
          this.curItem=this.tabs[0]
        }
        params.tab=this.curItem.key
      }
    },
    created:function () {

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .w-base{
    clear: both;
    background-color: #fff;
    border: 1px solid #d6dee3;
    &-title{
      height: 45px;
    }

    .assign-title .w-base-switch{
      overflow: visible;
      background-color: #fff;
      padding: 0;
      li{
        position: relative;
        float: left;
        height: 46px;
        overflow: hidden;
        border-bottom: 1px solid #d6dee3;
        a {
          font-size: 14px;
          color: #000;
          padding: 15px;
          display: block;
        }
        a:hover{
          background-color: #f8f8f8;
        }
        a:hover .h-arrow {
          height: 3px;
        }
        .h-arrow {
          background-color: #189cfb;
          width: 100%;
          font: 0/0 arial;
          position: absolute;
          left: 0;
          top: 0;
          height: 0;
          i {
            position: absolute;
            left: 50%;
            top: 3px;
            margin: 0 0 0 -5px;
            background-position: 0 -8px;
            display: none;
          }
        }
      }
      li.active {
        border-bottom: none;
        border-right: 1px solid #dfdfdf;
        border-left: 1px solid #dfdfdf;
        a {
          border: none;
          color: #189cfb;
          background-color: #fff;
        }
        .h-arrow{
          height: 3px;
          .w-icon-arrow {
            display: block!important;
          }
        }
      }
      li:first-child {
        border-left: none!important;
      }
    }

  }
</style>
