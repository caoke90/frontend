<template>
  <div class="container" :class="{'containerpt':isWord==true}" id="container" v-if="status!=='loading'">
    <template v-if="status==='loaded'">
      <p v-if="card_group.length!=0&&isWord==false" class="qCount">共<span class="num">{{qcount}}</span>道题</p>
      <div class="seleWarp" :class="{'seleWarpFixed':isWord==true}" v-if="card_group.length!=0&&isWord==true">
                <div class="card23" >
                    共 {{ qcount }} 大题
                    <div class="btn remove" v-if="isselect" @click="toggle">全部移除</div>
                    <div class="btn" v-else @click="toggle">全部选入</div>
                </div>
        </div>
      <scroller :data="card_group" @loadmore="next">
        <div class="box" slot-scope="props">
          <question  :question='props.item' :qindex="props.index" ></question>
          <!--<div style="height: 0.2rem;background: #f5f6f7;"></div>-->
        </div>
      </scroller>
      <template v-if="card_group.length===0">
        <msg style="height: 5rem;" :card="{type:'empty',msg:'本地化内容生产中,敬请期待~'}"></msg>
      </template>
      <div v-if="card_group.length&&!end" class="weui-loadmore">
        <i class="weui-loading"></i>
        <span class="weui-loadmore__tips">正在加载更多…</span>
      </div>
      <div v-if="end" class="weui-loadmore weui-loadmore_line">
        <span class="weui-loadmore__tips">没有更多了</span>
      </div>
    </template>
    <template v-else-if="status==='error'">
      <msg style="height: 5rem;" :card="{type:'error',msg:errMsg}"></msg>
    </template>
  </div>

</template>

<script>
import Question from "../models/question/Question";
//导航下拉框
import kpBar from "../components/kpBar.vue"; //知识点专项
import reviewTypeBar from "../components/reviewTypeBar.vue"; // 题型转项
import Bus from "../marvel/bus";

import ajax from "../api/ajax";
//网络异常
import msg from "../components/cards/msg.vue";

import { hget } from "../utils/hobj";
import log from "../common/js/utils/logConfig";
import { sendLog } from "../common/js/logger";

//购物车
import Cart from "../api/cart";
import scroller from "../marvel/scroller";
import { getInitParams, updateTitle } from "../common/js/external/index";
let type = getInitParams().type;
if (type == "QUESTION_TYPE") {
  Bus.addModalComponent(reviewTypeBar);
} else if (type == "KNOWLEDGE_POINT") {
  Bus.addModalComponent(kpBar);
}

export default {
  data() {
    return {
      status: "loading",
      errMsg: "",
      allcard_group: [],
      card_group: [],
      isFilter: false,
      buzy: false,
      end: false,
      qcount: 0,
      Catchqcount: 0, //保留原来题目数
      catalog_id: "",
      type: "",
      isWord: "",
      params: {
        grade_id: 8,
        region_id: 110000,
        subtype_id: 203000001,
        subtype_id_type: 1,
        filter_used: 1,
        page: 1,
        page_size: 10
      },
      question_list: [] // 增加数据分页功能  全部question
    };
  },
  components: {
    scroller,
    msg
  },
  computed: {
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
          type: "remove_questions",
          ques: this.question_list
        });
      } else {
        Bus.$emit("Cart", {
          type: "add_questions",
          ques: this.question_list
        });
      }
    },
    filter: function() {
      if (this.params.type == "QUESTION_TYPE") {
        // 题型转项
        if (!Bus.reviewTypeBar.isFilter) {
          this.card_group = this.allcard_group;
          this.qcount = this.Catchqcount;
        } else {
          this.qcount = Bus.reviewTypeBar.qcount;
          let arr = [];
          this.allcard_group.forEach(function(question) {
            if (!question.isUsed) {
              arr.push(question);
            }
          });
          this.card_group = arr;
          this.loadFilter();
        }
      } else if (this.params.type == "KNOWLEDGE_POINT") {
        //知识点专项
        if (!Bus.kpBar.isFilter) {
          this.card_group = this.allcard_group;
          this.qcount = this.Catchqcount;
        } else {
          this.qcount = Bus.kpBar.qcount;
          let arr = [];
          this.allcard_group.forEach(function(question) {
            if (!question.isUsed) {
              arr.push(question);
            }
          });
          this.card_group = arr;

          this.loadFilter();
        }
      }
    },
    loadFilter: async function() {
      Bus.$emit("loading", true);
      while (this.card_group.length < 10 && !this.buzy && !this.end) {
        await this.next();
      }
      Bus.$emit("loading", false);
    },
    // 题目 数据格式
    formatQuesData: function(question, category) {
      // 拼接category
      question.category = Object.assign({}, category, {
        catalog_id: this.catalog_id || ""
      });
      const ques = new Question(question);
      ques.selected = Cart.hasQuestion(ques);
      return ques;
    },
    has: function(question, card_group) {
      let has = -1;
      for (let i = 0; i < card_group.length; i++) {
        if (question.id == card_group[i].id) {
          has = i;
          break;
        }
      }
      return has;
    },

    next: async function() {
      if (!this.buzy && !this.end) {
        console.log("加载更多数据");
        this.buzy = true;
        await this.loadmore();
        this.buzy = false;
      }
    },
    loadmore: async function() {
      this.params.page += 1;
      let resp;
      if (this.params.type == "QUESTION_TYPE") {
        resp = await this.getcontentType(this.params);
      } else if (this.params.type == "KNOWLEDGE_POINT") {
        resp = await this.getcontentKP(this.params);
      }

      if (resp.data.message == "ok" && this.buzy == true) {
        const pageData = resp.data.data;
        const allcard_group = [];
        this.qcount = pageData.page_info ? pageData.page_info.total_number : 0;
        pageData.question_boxs.forEach(question => {
          allcard_group.push(this.formatQuesData(question, pageData.category));
        });
        this.allcard_group = this.allcard_group.concat(allcard_group);
        if (
          resp.data.data.page_info.now_page ==
          resp.data.data.page_info.total_page
        ) {
          this.end = true;
        }
        this.filter();


      }
    },
    // 更新购物车
    refreshCart: async function(refresh) {
      if (refresh) {
        await Cart.refresh();
      }
      this.allcard_group.forEach(item => {
        item.selected = Cart.hasQuestion(item);
      });
    },
    // 请求具体的题目数据
    async getcontentKP({
      knowledge_point_id,
      word_knowledge_point_id,
      grade_id,
      question_type_id,
      filter_used,
      page,
      page_size
    }) {
      const params = {
        knowledge_point_id,
        word_knowledge_point_id,
        grade_id,
        question_type_id,
        filter_used,
        page,
        page_size
      };
      console.log(params);
      return await ajax.post(
        "/review/knowledgePointDetail",
        this.formatData(params)
      );
    },
    async getcontentType({
      grade_id,
      region_id,
      subtype_id,
      subtype_id_type,
      filter_used,
      page,
      page_size
    }) {
      const params = {
        grade_id,
        region_id,
        subtype_id,
        subtype_id_type,
        filter_used,
        page,
        page_size
      };
      console.log(params);
      return await ajax.post(
        "/review/questionTypesDetail",
        this.formatData(params)
      );
    },
    // 格式化数组参数
    formatData: function(params) {
      const data = {};
      for (let k in params) {
        if (typeof params[k] == "object") {
          data[k] = JSON.stringify(params[k]);
        } else {
          data[k] = params[k];
        }
      }

      return data;
    },
    // 中间部分
    nextInit: async function() {
      if (this.params.type == "KNOWLEDGE_POINT") {
        //知识点专项
        let isWord = Bus.kpBar.listDataWord.length == 0 ? false : true;
        this.isWord = isWord;
        if (isWord) {
          //是空字符传说明是是词汇，
          this.params.grade_id = 0;
          this.params.knowledge_point_id = "";
          this.params.word_knowledge_point_id = Bus.kpBar.curSelectWords;
        } else {
          //展示年级
          this.params.grade_id = Bus.kpBar.curSelectGrade._id;
        }
        this.params.question_type_id = Bus.kpBar.curSelectsubtypes;
        console.log(this.params.question_type_id);
        this.params.page = 1;
        Bus.$emit("loading", true);
        const resp = await this.getcontentKP(this.params);
        if (resp.data.message == "ok") {
          this.end = false;
          const pageData = resp.data.data;
          const allcard_group = [];
          this.Catchqcount = pageData.page_info
            ? pageData.page_info.total_number
            : 0;
          Bus.kpBar.qcount = this.Catchqcount;
          //判断开关是否开启
          if (Bus.kpBar.isFilter) {
            Bus.kpBar.qcount = this.Catchqcount;
          }
          pageData.question_boxs.forEach(question => {
            if (this.has(question, allcard_group) == -1) {
              allcard_group.push(
                this.formatQuesData(question, pageData.category)
              );
            }
          });

          this.allcard_group = allcard_group;

          //判断知识点专项中是词汇查询时
          if (this.isWord == true) {
            const question_list_temp = [];
            pageData.question_list.forEach(question => {
              if (this.has(question, question_list_temp) == -1) {
                question_list_temp.push(
                  this.formatQuesData(question, pageData.category)
                );
              }
            });
            this.question_list = question_list_temp;
          }
          if (
            resp.data.data.page_info.now_page ==
            resp.data.data.page_info.total_page
          ) {
            this.end = true;
          }
          this.filter();

          this.status = "loaded";
        } else if (resp.data.message == "无题型ID") {
          this.status = "loaded";
          this.card_group.length = 0;
          this.errMsg = "本地化内容生产中,敬请期待~";
        } else {
          this.status = "error";
          this.errMsg = resp.data.message;
        }
        Bus.$emit("loading", false);
      } else if (this.params.type == "QUESTION_TYPE") {
        //题型专项
        this.params.page = 1;
        this.params.grade_id = Bus.reviewTypeBar.curSelectWord.grade_id;

        Bus.$emit("loading", true);
        const resp = await this.getcontentType(this.params);
        if (resp.data.message == "ok") {
          this.end = false;
          const pageData = resp.data.data;
          const allcard_group = [];
          this.Catchqcount = pageData.page_info
            ? pageData.page_info.total_number
            : 0;
          Bus.reviewTypeBar.qcount = this.Catchqcount;
          //判断开关是否开启
          if (Bus.reviewTypeBar.isFilter) {
            Bus.reviewTypeBar.qcount = this.Catchqcount;
          }
          pageData.question_boxs.forEach(question => {
            if (this.has(question, allcard_group) == -1) {
              allcard_group.push(
                this.formatQuesData(question, pageData.category)
              );
            }
          });
          this.allcard_group = allcard_group;

          if (
            resp.data.data.page_info.now_page ==
            resp.data.data.page_info.total_page
          ) {
            this.end = true;
          }
          this.filter();

          this.status = "loaded";
        } else {
          this.status = "error";
        }
        Bus.$emit("loading", false);
      }
    },
    // 初始化
    init: async function(params) {
      this.buzy = true;
      Object.assign(this.params, params);
      if (this.params.type == "QUESTION_TYPE") {
        //题型专项
        await ajax.all([Cart.getCardInfo(), Bus.reviewTypeBar.init(params)]);
      } else if (this.params.type == "KNOWLEDGE_POINT") {
        //知识点专项
        await ajax.all([Cart.getCardInfo(), Bus.kpBar.init(params)]);
      }
      await this.nextInit();
      this.buzy = false;
    }
  },

  mounted: async function() {
    let params = getInitParams();
    updateTitle(params.title, "", "");
    console.log(params);
    await this.init(params);

    if (this.params.type == "QUESTION_TYPE") {
      //题型专项
      Bus.reviewTypeBar.$on("nextInit", () => {
        this.nextInit();
      });
      Bus.reviewTypeBar.$on("filter", () => {
        this.filter();
      });
    } else if (this.params.type == "KNOWLEDGE_POINT") {
      //知识点专项
      Bus.kpBar.$on("nextInit", () => {
        this.nextInit();
      });
      Bus.kpBar.$on("filter", () => {
        this.filter();
      });
    }

    Bus.$on("refreshCart", () => {
      this.refreshCart(true);
    });
    // 如果购题车超出限制不能添加成功需要把select变更为false
    Bus.$on("updateCart", () => {
      this.refreshCart(false);
    });

    // // 页面load打点
    // let form = params.form == "tb" ? "titlePackage" : "titleEntry";
    // let proSource = params.form == "tb" ? "题包" : "题库入口";
    Bus.reviewDetail = this;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
.container {
  &.containerpt {
    padding-top: 2.13rem;
  }
  padding-top: 1rem;
  max-width: 750px;
  margin: 0 auto;
  font-size: 0.28rem;
  -webkit-overflow-scrolling: touch;
}
.box {
  margin-bottom: 0.2rem;
}
.card23 {
  background: #ffffff;
  padding: 0.3rem 0.4rem;
  position: relative;
  font-size: 0.28rem;
  max-width: 750px;
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
.qCount {
  height: 1rem;
  line-height: 1rem;
  padding: 0 0.4rem;
  font-size: 0.28rem;
  letter-spacing: 0.03rem;
  color: #58595e;
  background: #fff;
  margin-bottom: 0.2rem;
  .num {
    letter-spacing: 0;
    padding: 0 0.05rem;
  }
}
.seleWarp {
  &.seleWarpFixed {
    position: fixed;
    top: 1rem;
  }
  height: 1rem;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  width: 100%;
  left: 0;
  z-index: 10;
}
.card23 {
  background: #ffffff;
  padding: 0.3rem 0.4rem;
  font-size: 0.28rem;
  position: relative;
  color: #58595e;
  width: 100%;
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
    font-family: PingFangSC-Regular;
    text-align: center;
    line-height: 0.55rem;
    height: 0.55rem;
    cursor: pointer;
    box-sizing: border-box;
  }
  .btn.remove {
    background: #007aff;
    border-radius: 2rem;
    color: #fff;
  }
}
</style>
