<template>
  <div class="bd">
    <ul>
      <li v-for="(item, index) in tabs" :class="{active: index===num}" @click="tab(index)">
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
  import Bus from '@/marvel/bus.js'
  import qs from 'qs'
  import sa from '../../utils/sensorsdata'

  export default {
    name: 'leftmenu',
    props:['tabs'],
    data () {
      return {
        num: 0
      }
    },
    methods: {
      tab: async function(index) {
        if (this.num === index) {
          return
        }
        this.sendLog(index);
        this.num = index
        this.$emit('changePracticeType',index)
        // 请求接口
        // await this.$refs.rightinfo.init(index)
      },
      //神策打点
      sendLog: function(index) {
        let self = this
        let params = qs.parse(location.search.substr(1))
        let paramsArr = {
          sync : '教材同步',
          junior_review : '听说专区',
          entrance_exam_review : '复习专区',
          workbook : '教辅选题',
          classic : '经典读物'
        }
        sa.track('onlineEn_Assignment_SyncClick', {
          moduleName: paramsArr[params.tab],
          buttonName: self.tabs[index]
        });
      },
      init:async function (num) {
        Bus.leftmenu = this
        this.num=num||0;
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .bd{
    border: 1px solid #DBE6EE;
    min-height: 100px;
    ul {
      background: #fff;
      li.active{
        color: #159CFC;
        background: #F5FBFF!important;
      }
      li{
        font-size: 14px;
        color: #555555;
        height: 50px;
        padding-left: 20px;
        line-height: 50px;
        border-bottom: 1px solid #DBE6EE;
        cursor: pointer;
      }
      li:hover{
        background: #F8F8F8;
      }
      li:last-child{
        border-bottom: none;
      }
    }
  }

</style>
