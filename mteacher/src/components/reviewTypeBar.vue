<template>
  <div class="card" >
    <div class="selectBar" >
      <div class="banner"  v-if="curSelectWord.name">
        <p @click="selectBtn('word')">{{curSelectWord.name}}<i :class="{cur: toggleSelect == 'word'}"></i></p>
        <p class="switch">
          过滤已使用
          <label><input class="mui-switch" @click="filter_swith" :checked="isFilter" type="checkbox"></label>
        </p>
      </div>
      <div class="content">
        <div ref="content">
          <div class="item wordItem animated" :class="{'slideInDown' : toggleSelect == 'word'}" v-show="toggleSelect == 'word'">
            <div v-if="listData.length">
              <div class="li" v-press:active v-for="(item,key) in listData" :class="{'cur' : curSelectWord.grade_id == item._id}" @click="selectWord(item)" :key="key">{{item.name}}</div>
            </div>
            <div class="item" v-else>
              <div style="height: 5.18rem;"><Msg :card="{type:'empty', msg: '暂无满足条件的选项' , noshowimg:true}"></Msg></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mark" v-show="toggleSelect" @touchmove.stop.prevent @click="cancel"></div>
  </div>
</template>
<script>
import { bodyNoScroll } from "../utils/bodyNoScroll.js";
import Bus from "../marvel/bus";
import ajax from "../api/ajax";
import Msg from "./cards/msg";
import log from "../common/js/utils/logConfig";
import { sendLog } from "../common/js/logger";
export default {
  components: { Msg },
  data: function() {
    return {
      isFilter: false,
      toggleSelect: "",
      curSelectWord: { _id: "8", name: "八年级" },
      listData: [],
      params: {

      },
      qcount:0
    };
  },
  name: "selectBar",
  computed: {},
  watch: {
    toggleSelect: function(val) {
      if (val) {
        bodyNoScroll(true);
      } else {
        bodyNoScroll(false);
      }
    }
  },
  methods: {
    // 选择
    selectBtn: function(toggleSelect) {
      if (this.toggleSelect === toggleSelect) {
        this.cancel();
      } else {
        this.toggleSelect = toggleSelect;
      }
    },
    //获得题目数量
    getQCount: async function() {
      console.log(Bus.reviewDetail.params)
      const resp = await Bus.reviewDetail.getcontentType(Bus.reviewDetail.params);
      this.qcount = resp.data.data ? resp.data.data.page_info.total_number : 0;
      if(!this.isFilter){
        Bus.reviewDetail.Catchqcount=this.qcount
      }
      await this.$emit("filter");
    },
    filter_swith: function() {
      this.toggleSelect = "";
      this.isFilter = !this.isFilter;
      let status = this.isFilter ? "filter" : "nofilter";
      if (this.isFilter) {
        Bus.reviewDetail.params.filter_used = 2;
        //过滤已使用--题型专项详情页打点
        sendLog("", "", {
          event: "onlineEn_filterFunction",
          logData: { platformType: "H5", filterFunction: '过滤已使用', modelName: '复习专区',screenType:'题型专项详情页'}
        })
        this.getQCount();
      } else {
        Bus.reviewDetail.params.filter_used = 1;
        this.getQCount()
      }
      // setTimeout(() => {
      //   this.$emit("filter");
      // }, 500);
    },
    cancel: function() {
      this.toggleSelect = "";
    },
    // 选中年级
    selectWord: function(item) {
      this.curSelectWord.grade_id = item._id;
      this.curSelectWord.name = item.name;
      this.toggleSelect = "";
      this.$emit("nextInit");
    },
    // 初始化
    init: async function(params) {
      Object.assign(this.params, params);
      const resp = await ajax.post("/review/knowledgePointSearchConditions", {
        unit_id: "",
        grade_id: this.params.grade_selected._id,
        knowledge_point_id: "",
        type: 2
      });
      const info = resp.data.data;
      this.listData = [];
      this.listData = info.grade;
      this.curSelectWord.grade_id = info.grade_selected._id;
      this.curSelectWord.name = info.grade_selected.name;
    }
  },
  created: async function() {
    Bus.reviewTypeBar = this;
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
@import "@/common/scss/animate.scss";
.card {
  width: 7.5rem;
  margin: 0 auto;
  height: 0;
}
.selectBar {

  position: fixed;
  top: 0;
  left: 0;
  width: 7.5rem;
  font-size: 0.28rem;
  background-color: #fff;
  z-index: 99;
  overflow: hidden;
  .banner {
    height: 1rem;
    position: relative;
    display: flex;
    .blue {
      color: #007aff;
    }
    &:after {
      content: "";
      height: 0.02rem;
      background: #e5e5e5;
      width: 7.5rem;
      position: absolute;
      left: 0;
      bottom: 0;
      transform: scaleY(0.5);
    }
    p {
      text-align: left;
      // padding-left: .48rem;
      float: left;
      line-height: 1rem;
      color: #58595e;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      -webkit-line-clamp: 1;
      flex: 1;

      &:first-child {
        padding-left: 0.4rem;
        position: relative;
      }
      i {
        display: inline-block;
        width: 0.16rem;
        height: 0.08rem;
        margin: 0 0 0.06rem 0.12rem;
        background: url("../assets/img/arrow_down.png") no-repeat;
        background-size: 100% 100%;
      }
      .cur {
        background: url("../assets/img/arrow_up.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .switch {
      line-height: 1rem;
      float: right;
      padding-right: 0.42rem;
      color: #58595e;
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
          content: "";
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
          border-color: #007aff;
          box-shadow: #007aff 0 0 0 16px inset;
          background-color: #007aff;
          &:before {
            left: 0.32rem;
          }
        }
      }
    }
  }
  .content {
    user-select: none; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;
    max-height: 6.05rem;
    overflow-y: scroll;
    background-color: rgba(0, 0, 0, 0.7);
    .wordItem {
      background: #fff;
      .li {
        position: relative;
        padding-left: 0.4rem;
        font-size: 0.28rem;
        line-height: 1rem;
        color: #333333;
        font-family: PingFangSC-Regular;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 100%;
        &:after {
          content: "";
          height: 0.02rem;
          background: #eeeeee;
          width: 7.1rem;
          position: absolute;
          right: 0;
          bottom: 0;
          transform: scaleY(0.5);
        }
      }
      .li.active {
        background: rgba(0, 0, 0, 0.05);
      }
      .cur {
        color: #007aff;
        &:before {
          content: "";
          position: absolute;
          right: 0.4rem;
          top: 0.3rem;
          width: .48rem;
          height: .48rem;
          background: url('../assets/img/que-selected.png') no-repeat;
          background-size: contain;
        }
      }
    }
    .item {
      background: #fff;
    }
    .pointItem {
      position: relative;
      max-height: 6.05rem;
      overflow-y: hidden;
      background: #fff;
      &-wrap {
        position: relative;
        max-height: 6.05rem;
        padding: 0.32rem 0.4rem;
        overflow-y: scroll;
        &:before {
          /*content: "";*/
          /*position: absolute;*/
          /*left: 0;*/
          /*top: 0.3rem;*/
          /*width: 0.08rem;*/
          /*height: 0.4rem;*/
          /*background-color: #007aff;*/
        }
      }
      .litop {
        line-height: 0.4rem;
        margin-bottom: 0.32rem;
        color: #58595E;
        font-size: 0.28rem;
      }
      .licont {
        height: auto;
        margin-bottom: 1rem;
        .span {
          display: inline-block;
          height: 0.59rem;
          line-height: 0.59rem;
          margin: 0 0.2rem 0.3rem 0;
          padding: 0 0.3rem;
          text-align: center;
          font-size: 0.24rem;
          color: #58595e;
          background: #f5f6f8;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 100%;
          box-sizing: border-box;
          border: 1px solid #ffffff;
          border-radius: 0.08rem;
        }
        .cur {
          background-color: #f2f8ff;
          color: #007aff;
          border: 1px solid #007aff;
        }
      }
      .btnItem {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 1.2rem;
        width: 7.5rem;
        padding: 0.2rem 0.4rem;
        border-top: 1px solid #eeeeee;
        background: #fff;
        .btn {
          color: #58595e;
          background-color: #f5f6f8;
          width: 3.2rem;
          height: 0.8rem;
          line-height: 0.8rem;
          text-align: center;
          font-size: 0.32rem;
          border-radius: 1rem;
        }
        .btn.clear {
          float: left;
        }
        .btn.ok {
          float: right;
          background: #007aff;
          color: #fff;
        }
        .cancelBtn {
          color: #58595e;
        }
        .btn.active {
          color: #ffffff;
          background: #005bbf;
        }
        .cancelBtn.active {
          color: #58595e;
          background: #e8e9eb;
        }
      }
    }
    .typeItemlicont {
      height: auto;
      margin-bottom: 1rem;
      .span {
        display: inline-block;
        height: 0.59rem;
        line-height: 0.59rem;
        width: 3.2rem;
        text-align: center;
        // font-family: SFUIDisplay-Regular;
        font-size: 0.24rem;
        color: #58595e;
        background: #f5f6f8;
        margin-bottom: 0.3rem;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 100%;
        box-sizing: border-box;
        border-radius: 0.08rem;
        border: 1px solid #f5f6f8;
      }
      .span:nth-child(odd) {
        margin-right: 0.3rem;
      }
      .cur {
        background-color: #f2f8ff;
        color: #007aff;
        border: 1px solid #007aff;
      }
    }
  }
}
.mark {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
