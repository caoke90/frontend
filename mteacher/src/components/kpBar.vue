<template>
  <div class="card" >
    <div class="selectBar" >
      <div class="banner"  v-if="curSelectWord.name">
        <p  v-if="isWord" @click="selectBtn('word')"><span :class="ishasWord?'blue':''">词汇</span><i :class="{cur: toggleSelect == 'word'}"></i></p>
        <p  v-if="!isWord" @click="selectBtn('grade')">{{curSelectGrade.name}}<i :class="{cur: toggleSelect == 'grade'}"></i></p>
        <p   @click="selectBtn('type')"><span :class="ishastype?'blue':''">题型</span><i :class="{cur: toggleSelect == 'type'}"></i></p>
        <div class="switch">
          过滤已使用
          <label><input class="mui-switch" @click="filter_swith" :checked="isFilter" type="checkbox"></label>
        </div>
      </div>
      <div class="content">
        <div ref="content">
           <div class="item pointItem animated" :class="{'slideInDown' : toggleSelect == 'word'}" v-show="toggleSelect == 'word'&&isWord">
              <div v-if="listDataWord.length">
                <div class="pointItem-wrap">
                  <div class="typeItemlicont">
                    <div  v-for="(item,key) in listDataWord">
                      <div class="litop">{{item.word}}</div>
                      <div class="span" v-for="(item1,key1) in item['children']" :class="{'cur' : item1.selected}" @click="selectSubWord(item,item1)">{{item1.name}}</div>
                    </div>
                  </div>
                </div>
                <div class="btnItem">
                  <div @click="reset('word')" v-press:active class="btn clear cancelBtn">重置</div>
                  <div @click="confirm('word')" v-press:active class="btn ok">确定</div>
                </div>
              </div>
              <div class="item" v-else>
                <div style="height: 5.18rem;"><Msg :card="{type:'empty', msg: '暂无筛选条件' , noshowimg:true}"></Msg></div>
              </div>
            </div>
          <div class="item wordItem animated" :class="{'slideInDown' : toggleSelect == 'grade'}" v-show="toggleSelect == 'grade'&&!isWord">
            <div v-if="listDataGrade.length">
              <div class="li" v-press:active v-for="(item,key) in listDataGrade" :class="{'cur' : curSelectGrade._id === item._id}" @click="selectWord(item)" :key="key">{{item.name}}</div>
            </div>
            <div class="item" v-else>
              <div style="height: 5.18rem;"><Msg :card="{type:'empty', msg: '暂无满足条件的选项' , noshowimg:true}"></Msg></div>
            </div>
          </div>
          <template  v-if="toggleSelect == 'type'">
            <div class="item pointItem animated" :class="{'slideInDown' : toggleSelect == 'type'}">
              <div v-if="cacheSelectsubtypes.length">
                <div class="pointItem-wrap">
                  <div class="typeItemlicont">
                    <div class="span" v-for="(item,key) in cacheSelectsubtypes" :class="{'cur' : item.selected}" @click="selectSubType(item)">{{item.name}}</div>
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
      curSelectWord: {
        model: "REVIEW_GRAMMAR",
        name: "语法",
        kps: []
      },
      cacheSelectsubtypes: [{ name: "不限", nid: "all" }],
      curSelectsubtypes: [],
      listDataWord: [], //词汇列表
      curSelectWords: [], //当前选择的词汇ID
      listDataGrade: [], //年级列表
      curSelectGrade: { _id: "7,8,9", name: "全部年级" },
      params: {},
      ishastype: false,
      ishasWord: false,
      qcount: 0
    };
  },
  name: "selectBar",
  computed: {
    isWord: function() {
      return this.listDataWord.length === 0 ? false : true;
      // return this.listDataWord.length===0?true:false
    }
  },
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
    ishasWordFn: function() {
      //判断词汇是否有选中
      var has = false;
      this.listDataWord.forEach(ele => {
        ele.children.forEach(ele1 => {
          if (ele1._id != "all" && ele1.selected == true) {
            has = true;
            return false;
          }
        });
      });
      return has;
    },
    ishastypeFn: function() {
      //判断题型是否被选中
      var has = false;
      this.cacheSelectsubtypes.forEach(ele1 => {
        if (ele1.nid != "all" && ele1.selected == true) {
          has = true;
          return false;
        }
      });
      return has;
    },
    // 找到词汇题型
    findAllWordId: function(listData, curSelect) {
      curSelect.length = 0;
      listData.forEach(ele => {
        ele.children.forEach(ele1 => {
          if (ele1._id != "all" && ele1.selected == true) {
            curSelect.push(ele1._id);
          } else if (ele1._id == "all" && ele1.selected == true) {
            ele.children.forEach(ele2 => {
              if (ele2._id != "all") {
                curSelect.push(ele2._id);
              }
            });
          }
        });
      });
      if (curSelect.length == 0) {
        this.resetInitWord();
      }
    },
    // 找到词汇题型
    findAllTypeId: function(listData, curSelect) {
      curSelect.length = 0;
      listData.forEach(ele1 => {
        if (ele1.nid != "all" && ele1.selected == true) {
          curSelect.push(ele1.nid);
        } else if (ele1.nid == "all" && ele1.selected == true) {
          listData.forEach(ele2 => {
            if (ele2.nid != "all") {
              curSelect.push(ele2.nid);
            }
          });
        }
      });
      if (curSelect.length == 0) {
        this.resetInitType();
      }
    },
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
      const resp = await Bus.reviewDetail.getcontentKP(Bus.reviewDetail.params);
      this.qcount = resp.data.data ? resp.data.data.page_info.total_number : 0;
      if(!this.isFilter){
        Bus.reviewDetail.Catchqcount=this.qcount
      }

      await this.$emit("filter");
      // setTimeout(() => {
      //   alert('222')
      // }, 0);
    },
    filter_swith: function() {
      this.toggleSelect = "";
      this.isFilter = !this.isFilter;
      let status = this.isFilter ? "filter" : "nofilter";
      if (status == "filter") {
        Bus.reviewDetail.params.filter_used = 2;
        //过滤已使用--知识点专项详情页打点
        sendLog("", "", {
          event: "onlineEn_filterFunction",
          logData: { platformType: "H5", filterFunction: '过滤已使用', modelName: '复习专区',screenType:'知识点专项详情页'}
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
    selectWord: async function(item) {
      this.curSelectGrade = item;
      await this.getNewType();
      this.toggleSelect = "";
      this.$emit("nextInit");
    },
    //题型跟着年级联动
    async getNewType() {
      const resp = await ajax.post("/review/knowledgePointSearchConditions", {
        unit_id: this.params.unit_id,
        grade_id: this.curSelectGrade._id,
        knowledge_point_id: this.params.knowledge_point_id
      });
      let info = resp.data.data;

      let cacheSelectsubtypes = [{ name: "不限", nid: "all" }].concat(
        info.question_type
      );
      cacheSelectsubtypes.forEach(ele => {
        if (ele.nid == "all") {
          ele.selected = true;
        } else {
          ele.selected = false;
        }
      });
      this.cacheSelectsubtypes = cacheSelectsubtypes;
      this.findAllTypeId(this.cacheSelectsubtypes, this.curSelectsubtypes);
    },
    // 选中词汇
    selectSubWord: function(item, item1) {
      this.listDataWord.forEach(ele => {
        if (item.word == ele.word) {
          ele.children.forEach(ele1 => {
            if (item1._id == ele1._id) {
              if (item1._id == "all") {
                ele1.selected = ele1.selected ? false : true;
                ele.children.forEach(ele2 => {
                  if (ele2._id != "all") {
                    ele2.selected = false;
                  }
                });
              } else {
                ele.children[0].selected = false;
                ele1.selected = ele1.selected ? false : true;
              }
            }
          });
        }
      });
    },
    // 选中题型
    selectSubType: function(item) {
      this.cacheSelectsubtypes.forEach(ele => {
        if (item.nid == ele.nid) {
          if (item.nid == "all") {
            ele.selected = ele.selected ? false : true;
            this.cacheSelectsubtypes.forEach(ele => {
              if (ele.nid != "all") {
                ele.selected = false;
              }
            });
          } else {
            this.cacheSelectsubtypes[0].selected = false;
            ele.selected = ele.selected ? false : true;
          }
        }
      });
    },
    resetInitWord: function() {
      //重置词汇
      this.listDataWord.forEach(ele => {
        ele.children.forEach(ele => {
          if (ele._id == "all") {
            ele.selected = true;
          } else {
            ele.selected = false;
          }
        });
      });
    },
    resetInitType: function() {
      //重置题型
      this.cacheSelectsubtypes.forEach(ele => {
        if (ele.nid == "all") {
          ele.selected = true;
        } else {
          ele.selected = false;
        }
      });
    },
    // 重置
    reset: function(seletedtype) {
      this.toggleSelect = "";
      if (seletedtype == "word") {
        this.resetInitWord();
      } else if (seletedtype == "type") {
        this.resetInitType();
      }
      this.findAllWordId(this.listDataWord, this.curSelectWords);
      this.findAllTypeId(this.cacheSelectsubtypes, this.curSelectsubtypes);
      this.ishastype = this.ishastypeFn(); //如果题型有选中，题型颜色变化
      this.ishasWord = this.ishasWordFn();
      this.$emit("nextInit");
    },
    // 确认
    confirm: function(seletedtype) {
      this.findAllWordId(this.listDataWord, this.curSelectWords);
      this.findAllTypeId(this.cacheSelectsubtypes, this.curSelectsubtypes);
      if (this.curSelectWords.length == 0) {
        //当什么都不选择时
        this.findAllWordId(this.listDataWord, this.curSelectWords);
      }
      if (this.curSelectsubtypes.length == 0) {
        //当什么都不选择时
        this.findAllTypeId(this.cacheSelectsubtypes, this.curSelectsubtypes);
      }
      this.ishastype = this.ishastypeFn(); //如果题型有选中，题型颜色变化
      this.ishasWord = this.ishasWordFn();

      // let filterWord = [];

      if (seletedtype == "word") {
        this.listDataWord.forEach(ele => {
          let filterW = {};
          filterW.word = ele.word;
          filterW["children"] = [];
          ele.children.forEach(ele1 => {
            if (ele1._id != "all" && ele1.selected == true) {
              filterW["children"].push(ele1._id);
            } else if (ele1._id == "all" && ele1.selected == true) {
              filterW["children"].push(ele1.name);
            }
          });
          //分批打点
          sendLog("", "", {
            event: "onlineEn_Review_Content_wordFilter",
            logData: { platformType: "H5", filterModule: filterW.word }
          });
          sendLog("", "", {
            event: "onlineEn_Review_Content_wordFilter",
            logData: { platformType: "H5", filterWord: filterW.children }
          });
        });
      }

      this.toggleSelect = "";
      this.$emit("nextInit");
    },
    //词汇列表重组数据类型全部字段
    setInitParams: function(listData, listDataWord) {
      listDataWord.length = 0;

      for (let key in listData) {
        let obj = {};
        obj.word = key;
        obj.children = [];
        obj.children = [{ name: "不限", _id: "all" }].concat(listData[key]);
        obj.children.forEach(ele => {
          if (ele._id == "all") {
            ele.selected = true;
          } else {
            ele.selected = false;
          }
        });
        listDataWord.push(obj);
      }
    },
    // 初始化
    init: async function(params) {
      Object.assign(this.params, params);
      const resp = await ajax.post("/review/knowledgePointSearchConditions", {
        unit_id: params.unit_id,
        grade_id: this.params.grade_id,
        knowledge_point_id: this.params.knowledge_point_id
      });
      const info = resp.data.data;
      if (resp.data.message == "ok") {
        this.listDataWord = [];
        let listDataWord = info.word_knowledge_ponit;

        this.setInitParams(listDataWord, this.listDataWord);

        this.listDataGrade = [];
        this.listDataGrade = info.grade || [];
        this.curSelectGrade["_id"] = info.grade_selected
          ? info.grade_selected["_id"]
          : "";
        this.curSelectGrade["name"] = info.grade_selected
          ? info.grade_selected["name"]
          : "";
        let cacheSelectsubtypes = [{ name: "不限", nid: "all" }].concat(
          info.question_type
        );
        cacheSelectsubtypes.forEach(ele => {
          if (ele.nid == "all") {
            ele.selected = true;
          } else {
            ele.selected = false;
          }
        });
        this.cacheSelectsubtypes = cacheSelectsubtypes;
        this.findAllWordId(this.listDataWord, this.curSelectWords);
        this.findAllTypeId(this.cacheSelectsubtypes, this.curSelectsubtypes);
      }
    }
  },
  created: async function() {
    Bus.kpBar = this;
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
      padding-left: 0.48rem;
      float: left;
      line-height: 1rem;
      color: #58595e;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      -webkit-line-clamp: 1;
      flex: 1;
      text-align: left;

      &:first-child {
        padding-left: 0.4rem;
        position: relative;
      }
      &.leftLine::before {
        content: "";
        height: 0.6rem;
        margin-top: 0.2rem;
        background: #cccccc;
        width: 1px;
        float: left;
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
        padding:0.32rem 0.3rem 0.4rem;
        overflow-y: scroll;
        // &:before{
        //   content: '';
        //   position: absolute;
        //   left: 0;
        //   top: .3rem;
        //   width: .08rem;
        //   height: .4rem;
        //   background-color: #007AFF;
        // }
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
        // width: 2rem;
        margin: 0 0.2rem 0.3rem 0;
        padding: 0 0.3rem;
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
      // .span:nth-child(odd) {
      //   margin-right: 0.3rem;
      // }
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
