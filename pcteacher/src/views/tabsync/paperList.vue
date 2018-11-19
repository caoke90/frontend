<template>
  <div>
    <div class="paper-container">
      <div v-show="isloading" style="height: 400px; background-color: white; width: 100%;position: relative;">
        <img src="../../assets/img/loading.gif" style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/>
      </div>
      <template v-show="!isloading">
        <template v-if="list&&list.length>0">
          <p style="margin-bottom: 15px">共有<span class="paper-count">{{list.length}}</span>套单元套卷</p>
          <div class="paper-content">
            <ul class="paper-list" v-for="item in list">
              <li class="paper-item">
                <div class="paper-info">
                  <p class="paper-title" style="margin-bottom: 5px">{{item.title}}</p>
                  <p style="font-size: 12px;color:#7F7E7E;">单元练习 / 推荐热度 &nbsp;{{item.star}}&nbsp;颗星</p>
                </div>
                <div class="paper-btn" @click="openPaperPage(item)">
                  进入选题
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <msg style="height: 400px;" :card="{type:'empty'}"></msg>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import msg from '../../components/cards/msg.vue'
  import Bus from '../../marvel/bus.js'
  import ajax from '../../api/ajax.js'
  import qs from 'qs';

  export default {
    name: 'paperList',
    data: function(){
      return{
        isloading: true, //页面动画
        list:[],
        params: {
          bk_id: "",
          bkc_id: "",
          unit_id: ""
        }, // 请求参数
      }
    },
    components:{
      msg,
    },
    methods: {

      openPaperPage: function (page) {

        // let url = page.action.h5url;
        let params = Object.assign({}, this.params,{paper_id: page._id});
        let url = window.location.origin+(process.env.STAGE=='production'?'/s17':'')+"/pcteacher/paperdetail.html?"+qs.stringify(params);
        window.open(url,'_blank')
      },
      init:async function (params) {
        // 初始化参数
        this.params.bk_id=params.bk_id
        this.params.bkc_id=params.bkc_id
        this.params.unit_id=params.unit_id

        //初始化请求页面数据
        this.isloading = true;
        const content = await ajax.post('/pc/v1/assign/loadPaperList',this.params);
        this.list = content.data.data.list;
        this.isloading = false;
      }

    },
    created:async function (){
      Bus.paperList = this;

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .paper-container{
    background: #fff;
    min-height: 400px;
    border: 1px solid #DBE6EE;
    padding: 20px;
  }
  .paper-count{
    color: #159CFC;
    padding: 0 3px;
  }

  .paper-item {
    display: -webkit-flex; /* Safari */
    display: flex;
    margin-bottom: 10px;
    padding: 14px;
    border: 1px solid #DBE6EE;
  }

  .paper-info{
    flex: 1;
  }
  .paper-btn{
    min-width: 80px;
    background: #159CFC;
    height: 30px;
    padding: 8px 12px;
    color: #FFFFFF;
    cursor: pointer;
    border: 0 solid #159CFC;
    border-radius: 2px;
    margin-top: 8px;
    &:hover{
        background: #5CBBFF;
     }
  }
</style>
