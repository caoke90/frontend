<template>
  <div>
    <div class="container">
      <div class="tip-head">
        {{listTip}}
      </div>

      <div class="clazz-content" v-if="isLoaded">
        <div class="month-list" v-for="(v,k) in monthLists" :key="k">
          <p class="month-tip">{{v.title}}</p>
          <div class="clazz-list" v-press:clickbg  v-for="(item) in v.packages"  @click="openPackage(item.action)">
            <div class="clazz">
              <h3>{{item.packageName}}</h3>
                <p>共<span style="font-family: DIN-Regular;">{{item.questionCnt}}</span>题 · 错误率:
                  <template v-if="item.minErrorRate===item.maxErrorRate">
                    <span>{{item.minErrorRate}}%</span>
                  </template>
                  <template v-else>
                    <span style="font-family: DIN-Regular;">{{item.minErrorRate}}%-{{item.maxErrorRate}}%</span>
                  </template>
                </p>
            </div>
            <div class="arrow">
            </div>
          </div>
        </div>
      </div>

      <template v-else>
        <msg style="height: 5rem;" :card="{type:'empty',msg:'本周暂无高频错题~'}"></msg>
      </template>


    </div>
  </div>
</template>
<script>

  // 网络请求和异常
  import log from '../common/js/utils/logConfig';
  import {sendLog} from '../common/js/logger';
  import ajax from '../api/ajax';
  import msg from '../components/cards/msg.vue';
  import {getInitParams} from '../common/js/external/index';
  import {forwardPage} from  '../common/js/external/teacher'
  import qs from 'qs';

  export default {
    data () {
      return {
        isLoaded:false,
        monthLists: [],
        listTip:null,
      }
    },
    components: {
      msg,
    },
    methods: {

      openPackage: function (action) {
        sendLog(log.module.m_frequent,log.op.frequent_select_click,{s0:'english',s1:action.package_name});

        let actionparams = Object.assign({},action.params,this.tcquesparams);
        let data = {
          url: action.h5url,
          params: actionparams,
          needCart: true
        };

        if (window.external && window.external.forwardPage) {
          forwardPage(data);
        } else {
          let uri = window.location.origin+"/mteacher/frequentWrongQuestion.html?"+qs.stringify(action.params);
          window.open(uri,"_blank");
        }
      }
    },
    created: async function () {
      let params = getInitParams();
      let vm = this;

      vm.paperparams = {
        bk_id: params.bk_id,
        bkc_id: params.bkc_id,
        unit_id: params.unit_id
      };

      // 跳转题库所需参数
      vm.tcquesparams = {
        bk_id:  params.bk_id,
        class_level: params.extraParams?params.extraParams.class_level:params.class_level,
        unit_id:  params.extraParams?params.extraParams.unit_id:params.unit_id,
      };

      const [resp] = await ajax.all([
        ajax.post('/assign/lessonWrongPackageList',vm.paperparams),
      ]);
      if (resp.data.message === 'ok') {
        vm.listTip =  resp.data.data.tips;
        vm.monthLists = resp.data.data.list;
      }

      vm.isLoaded = (vm.monthLists.length>0);
      // 页面load打点
      sendLog(log.module.m_frequent,log.op.frequent_list_load,{s0:'english'});
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .container {
    max-width: 750px;
    margin: 0 auto;
    font-size: 0.26rem;
    -webkit-overflow-scrolling: touch;
    min-height: 100vh;
    color: #58595E;
    -webkit-touch-callout:none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .tip-head {
    background: #F2F8FF;
    padding: 0.3rem 0.4rem;

  }
  .clazz-content {
    width: 100%;
    height: 100%;
    font-size: 0.24rem;

    .month-list {
      padding: 0.4rem 0.4rem 0 0.4rem;
      margin-bottom: 0.2rem;
      background: #fff;
    }

    .month-tip {
      color: #58595E;
      font-size: 0.28rem!important;
      margin-bottom: 0.05rem;
    }


    .clazz-list {
      display: -webkit-flex; /* Safari */
      display: flex;
      padding: 0.4rem 0;
      border-bottom: 0.5px solid #E5E5E5;
    }

    .clazz-list:last-child {
      border: none!important;
    }

    .clickbg {
      background:#e6e6e6;
      margin-left: -0.4rem;
      margin-right: -0.4rem;
      padding: 0.4rem;
    }

    .clazz {
      flex: 1;
       h3 {
         font-size: 0.32rem;
         color: #171717;
         margin-bottom: 0.1rem;
       }
       p{
         letter-spacing:2px;
       }
    }
    .arrow {
      width: 0.3rem;
      background: url('../assets/img/upArrow.png') no-repeat;
      background-size: contain;
      transform: rotate(90deg);
      margin-right: 0.4rem;
      cursor: pointer;
    }

  }

</style>
