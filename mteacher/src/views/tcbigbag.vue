<template>
  <div>
    <div class="container" :style="{ paddingTop: isWordPage?'1rem':'0'}">
      <div class="" v-if="questionsCount" style="height:1.17rem;">
        <div class="card23 line" style="position: fixed;z-index:1;width: 100%;">
          共 {{ questionsCount }} 大题，预计 {{ finishedTime }} 分钟
          <div class="btn remove" v-if="isselect" @click="toggle">全部移除</div>
          <div class="btn" v-else @click="toggle">全部选入</div>
        </div>
        <div style="height: 0.2rem;background: #f5f6f7;"></div>
      </div>
      <template v-if="success === 'ok'">
        <scroller :data="card_group" @loadmore="next">
          <div class="box" slot-scope="props">
            <question  :question='props.item' :qindex="props.index" ></question>
          </div>
        </scroller>
        <template v-if="card_group.length===0">
          <msg style="height: 5rem;" :card="{type:'empty', msg: '本地化内容生产中，敬请期待～'}"></msg>
        </template>
        <div v-if="card_group.length&&!end" class="weui-loadmore">
          <i class="weui-loading"></i>
          <span class="weui-loadmore__tips">正在加载更多…</span>
        </div>
        <div v-if="end" class="weui-loadmore weui-loadmore_line">
          <span class="weui-loadmore__tips">没有更多了</span>
        </div>
      </template>
      <template v-else>
        <msg style="height: 5rem;" :card="{type:'error'}"></msg>
      </template>
    </div>
  </div>
</template>

<script>
  // 导航下拉框
  import log from "../common/js/utils/logConfig";
  import { sendLog } from "../common/js/logger";
  import Bus from "../marvel/bus";

  // 网络异常提示信息组件
  import msg from "../components/cards/msg.vue";
  import scroller from "../marvel/scroller";

  // 购物车和网络请求已经题目
  import Cart from "../api/cart";
  import ajax from "../api/ajax";
  import Question from "../models/question/Question";

  // 通过路径获取对象属性值
  import { hget } from "../utils/hobj";
  import {
    getInitParams,
    setTopBarInfo,
    updateTitle
  } from "../common/js/external/index";
  import qs from "qs";

  export default {
    data() {
      return {
        card_groupCache: [],
        card_group: [], //题目数据
        success: "", // 展示逻辑
        question_list: [], // 增加数据分页功能  全部question
        isloaded: false, // 数据是否加载完毕
        isWordPage: false,
        catalog_id: null, // 购题车category需要的参数

        pageUrl: null,
        buzy: false,
        end: false,
        total_page: 1,
        selectBarLock: false,
        page: 1 // 系统题包、大数据题包分页
      };
    },
    components: {
      msg,
      scroller
    },
    computed: {
      // 题目数量
      questionsCount: function() {
        return this.question_list.length;
      },

      // 题目全部完成时间
      finishedTime: function() {
        let time = 0;
        let card_list = this.question_list;
        if (card_list.length > 0) {
          card_list.forEach(function(card) {
            time += card.seconds || 0;
          });
        }
        return Math.ceil(time / 60);
      },

      // 全选
      isselect: function() {
        if (this.card_group.length > 0) {
          return this.card_group.every(function(card) {
            return card.selected;
          });
        }
      }
    },

    methods: {
      toggle: function() {
        if (!this.card_group.length) {
          return;
        }
        let isall = this.isselect;
        for (let i = 0; i < this.card_group.length; i++) {
          if (!isall) {
            this.card_group[i].selected = true;
          } else {
            this.card_group[i].selected = false;
          }
        }
        if (isall) {
          Bus.$emit("Cart", {
            type: "remove_questions_all",
            ques:this.question_list
          });
        } else {
          Bus.$emit("Cart", {
            type: "add_questions_all",
            ques:this.question_list
          });
        }
      },

      refreshData: async function(status, isFilter) {
        let category,
          question_boxs,
          question_list,
          card_groupTemp = [],
          question_list_temp = [];

        //初始化请求页面数据
        const [content] = await ajax.all([
          ajax.post(this.pageUrl, this.resolveJsonParams(this.bagparams)),
          Cart.getCardInfo()
        ]);

        if (hget(content, "data.message") === "ok") {
          if (this.page ==content.data.data.page_info.total_page) {
            this.end = true;
          } else {
            this.end = false;
          }
          //修改展示状态
          this.success = "ok";
          this.total_page = content.data.data.page_info.total_page;
          //通过路径获取对象属性值
          category = hget(content, "data.data.category", {});
          question_boxs = hget(content, "data.data.question_boxs", []);
          question_list = hget(content, "data.data.question_list", []);

          // 拼接category
          category = Object.assign({}, category, {
            catalog_id: this.catalog_id || ""
          });
          // 遍历question_boxs数组为item添加category属性
          question_boxs.length > 0 &&
          question_boxs.map(item => {
            item.category = category;
            return item;
          });

          // 遍历question_list数组为item添加category属性
          question_list.length > 0 &&
          question_list.map(item => {
            item.category = category;
            return item;
          });

          // 生成题目数据
          question_boxs.length > 0 &&
          question_boxs.forEach((item, index) => {
            const itemTemp = new Question(item);
            itemTemp.selected = Cart.hasQuestion(itemTemp);
            card_groupTemp.push(itemTemp);
          });

          question_list.length > 0 &&
          question_list.forEach((item, index) => {
            let listTemp = new Question(item);
            listTemp.selected = Cart.hasQuestion(listTemp);
            question_list_temp.push(listTemp);
          });
          if (status == "select") this.card_group = [];
          this.card_group = this.card_group.concat(card_groupTemp);
          this.question_list = question_list_temp;
          this.card_groupCache = card_groupTemp;
        } else {
          this.success = "fail";
        }
        this.isloaded = true;
      },
      refreshCart: async function(refresh) {
        if (refresh) {
          await Cart.refresh();
        }
        this.card_groupCache.forEach(item => {
          item.selected = Cart.hasQuestion(item);
        });
      },
      // 设置跳转题库
      setQuestionPage: function(params) {
        let url =
          window.location.origin +
          "/mteacher/tcques.html?" +
          qs.stringify(params);
        setTopBarInfo({
          show: true,
          rightText: "题库",
          rightTextColor: "212121",
          nextAction: url,
          needCart: true
        });
      },

      // 格式化参数
      resolveJsonParams: function(params) {
        const data = {};
        for (let k in params) {
          if (typeof params[k] === "object") {
            data[k] = JSON.stringify(params[k]);
          } else {
            data[k] = params[k];
          }
        }
        return data;
      },

      // 根据页面类型设置请求数据参数等
      setPackagePage: function(params) {
          this.bagparams = {
              bkc_id: params.bkc_id, //单元id 是
              bk_id: params.bk_id,
              package_name: params.package_name || "",
              unit_id: params.extraParams
                  ? params.extraParams.unit_id
                  : params.unit_id,
              package_type: params.package_type,
              class_level: params.extraParams
                  ? params.extraParams.class_level
                  : params.class_level,
              page: this.page
          };
          this.pageUrl = "/assign/getBigdataPackageContent";
      },

      //滚动加载数据
      next: async function() {
        if(!this.buzy&&!this.end) {
          this.page += 1;
          this.bagparams.page = this.page;
          this.buzy = true;
          await this.refreshData();
          this.buzy = false;
        }
      }
    },
    created: async function() {
      const vm = this;
      vm.pageType = this.$root.pageType;

      // 获取准备参数
      let params = getInitParams();
      updateTitle(params.package_name, "", "");
      vm.catalog_id = params.catalog_id;

      // 设置跳转到题库页面
      let quesParams = {
        bkc_id: params.bkc_id,
        bk_id: params.bk_id,
        class_level: params.extraParams
          ? params.extraParams.class_level
          : params.class_level,
        unit_id: params.extraParams ? params.extraParams.unit_id : params.unit_id,
        form: "tb"
      };
      quesParams["package_type"] = params.package_type || ""; // 大数据题包需要类型
      vm.setQuestionPage(quesParams);
      vm.setPackagePage(params);

      this.buzy = true;
      await this.refreshData();
      this.buzy = false;

      // 监听事件：条件删选变化，刷新购题车，购题车超出限制不能添加成功需要把select变更为false
      Bus.$on("refreshCart", () => {
        this.refreshCart(true);
      });

      Bus.$on("updateCart", () => {
        this.refreshCart(false);
      });

      //页面load打点
      sendLog(log.module.m_homework, log.op.tb_load, { s0: "english" });
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .container {
    max-width: 750px;
    margin: 0 auto;
    font-size: 0.28rem;
    -webkit-overflow-scrolling: touch;
    min-height: 100vh;
  }
  .box {
    margin-bottom: 0.2rem;
  }
  .line {
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
  }
  .card23 {
    background: #ffffff;
    padding: 0.3rem 0.4rem;
    position: relative;
    font-size: 0.28rem;
    -webkit-overflow-scrolling: touch;

    .btn {
      position: absolute;
      top: 0.22rem;
      right: 0.32rem;
      background: rgba(0, 122, 255, 0.05);
      border: 0.02rem solid #007aff;
      border-radius: 2rem;
      padding: 0 0.26rem;
      font-size: 0.28rem;
      color: #007aff;
      text-align: center;
      line-height: 0.52rem;
      cursor: pointer;
    }
    .btn.remove {
      background: #007aff;
      border-radius: 2rem;
      color: #fff;
    }
  }
  .buzy {
    text-align: center;
    height: 0.5rem;
    line-height: 0.5rem;
  }
</style>


