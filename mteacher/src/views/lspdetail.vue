<template>
  <div class="container" v-if='isloaded'>
    <div class="papertitle" ref="papertitle"><p>{{pageTitle}}</p></div>
    <div class="seleWarp">
      <div class="filterBar" v-show="questionsCache.length!==0">
        <div class="switch">
          过滤已使用
          <label><input class="mui-switch" @click="filter_swith" type="checkbox"></label>
        </div>
      </div>
      <div class="card23" v-if="questionsCount">
        共 {{ questionsCount }} 大题，预计 {{ finishedTime }} 分钟
        <div class="btn remove" v-if="isselect" @click="toggle">全部移除</div>
        <div class="btn" v-else @click="toggle">全部选入</div>
      </div>
    </div>
    <div ref="scrollContent" class="scoller" style="padding-top: 1rem;">
      <template v-if="success === 'ok'">
        <div class="question-container" v-for="(block,bk) in pageData.blocks" :key="bk"
             v-show="block.quesArr.length!==0">
          <div class="title">{{numMap[bk]||(bk+1)}}、{{block.name}}</div>
          <div class="box" v-for="(v,k) in block.quesArr" :key="k">
            <question :question='v' :qindex="k" :bagtype="pageType"></question>
          </div>
        </div>
        <template v-if="pageData.blocks.length===0">
          <msg :card="{type:'empty',msg:this.msg}"></msg>
        </template>
      </template>
      <template v-else>
        <msg :card="{type:'error'}"></msg>
      </template>
    </div>
  </div>
</template>

<script>

  //导航下拉框
  import Bus from '../marvel/bus';

  //网络异常
  import msg from '../components/cards/msg.vue';

  //购物车
  import Cart from '../api/cart';
  import {getNewContentTypeId} from '../api/type.js';
  import {sendLog} from '../common/js/logger';
  import log from '../common/js/utils/logConfig';

  //网络请求
  import ajax from '../api/ajax';
  //题目生成器
  import Question from '../models/question/Question';
  import {getInitParams, updateTitle} from '../common/js/external/index';


  export default {
    data() {
      return {
        success: '', // 展示逻辑
        isloaded: false, // 数据是否加载完毕
        numMap: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"],
        pageTitle: '',
        pageType: 'lspdetail',
        pageData: {
          duration: 0,
          question_count: 0,
          blocks: [],
          catalog_id: null
        },
        pageDataCache: {
          duration: 0,
          question_count: 0,
          blocks: [],
          catalog_id: null
        },
        isTop: false,
        questions: [],
        questionsCache: [],
        isFilter: false,
        msg: '本地化内容生产中，敬请期待～'
      }
    },
    components: {
      msg
    },
    updated() {
      //兼容安卓与ios滚动吸顶状态
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
      if (isAndroid) {
        var stickyEl = document.querySelector('.seleWarp');
        var stickyHolder = document.createElement('div');
        var rect = stickyEl.getBoundingClientRect();
        stickyEl.parentNode.replaceChild(stickyHolder, stickyEl);
        stickyHolder.appendChild(stickyEl);
        stickyHolder.style.height = rect.height + 'px';
        var stickyT = stickyEl.offsetTop;
        window.addEventListener('scroll', function (e) {
          var scrollT = document.body.scrollTop || document.documentElement.scrollTop;
          if (scrollT > stickyT) {
            stickyEl.classList.add('fixed-top');
          }
          else {
            stickyEl.classList.remove('fixed-top');
          }
        });
      }
    },
    computed: {
      // 题目数量
      questionsCount: function () {
        return this.questions.length
      },
      // 题目全部完成时间
      finishedTime: function () {
        let time = 0;
        if (this.pageData.blocks.length > 0) {
          this.questions.forEach(function (card) {
            time += card.seconds || 0;
          });
        }
        return Math.ceil(time / 60);
      },
      // 全选
      isselect: function () {
        if (this.pageData.blocks.length > 0) {
          return this.questions.every(function (card) {
            return card.selected;
          });
        }
      }

    },
    methods: {
      filter_swith: async function () {
        this.isFilter = !this.isFilter;
        if (this.isFilter) {
          this.msg = '本地化内容生产中，敬请期待～';
          this.pageData.blocks = this.pageDataCache.blocks;
          this.questions = this.questionsCache;
        } else {
          this.msg = '全部题目已使用';
          let cat = {};
          let allQuestion = [];
          let quesArr = [];
          this.pageDataCache.blocks.forEach(function (question) {
            question.quesArr.forEach((data) => {
              if (!data.isUsed) {
                if (!cat[question.name]) {
                  cat[question.name] = {
                    name: question.name,
                    forderId: question.forderId,
                    quesArr: [data]
                  }
                } else {
                  cat[question.name].quesArr.push(data)
                }
              }
            })
          });
          for (let k in cat) {
            allQuestion.push(cat[k]);
          }
          this.pageData.blocks = allQuestion;

          this.questionsCache.forEach(function (question) {
            if (!question.isUsed) {
              quesArr.push(question)
            }
          })
          this.questions = quesArr;
          sendLog("", "", {
            event: "onlineEn_filterFunction",
            logData: { platformType: "H5", filterFunction: '过滤已使用', modelName: '听说专区',screenType:'套卷详情页'}
          })
        }
      },
      //题目 数据格式
      formatQuesData: function (question) {
        const ques = new Question(question);
        ques.selected = Cart.hasQuestion(ques);
        ques.number = question.number
        ques.title = question.title
        if (question.newContentTypeId) {
          let item = getNewContentTypeId(question.newContentTypeId);
          ques.cname = item[2];
          ques.forderId = item[0];
        }
        else {
          ques.cname = '其他';
          ques.forderId = 1000;
        }
        this.questions.push(ques)
        this.questionsCache.push(ques)
        return ques;
      },
      refreshCart: async function (refresh) {
        if (refresh) {
          await Cart.refresh();
        }
        this.questions.forEach((card) => {
          card.selected = Cart.hasQuestion(card);
        });
      },
      toggle: function () {
        if (!this.pageData.blocks.length) {
          return;
        }
        let isall = this.isselect;
        let ques = [];
        for (let k = 0; k < this.questions.length; k++) {
          ques.push(this.questions[k]);
          if (!isall) {
            this.questions[k].selected = true;
          } else {
            this.questions[k].selected = false;
          }
        }
        if (isall) {
          Bus.$emit('Cart', {
            type: 'remove_questions',
            ques: ques
          })
        } else {
          sendLog(log.module.m_listenRead, log.op.ls_detail_select, {
            s0: 'english',
            s1: '套卷',
            s2: '全选',
            s3: this.paperparams.paper_id
          });
          Bus.$emit('Cart', {
            type: 'add_questions',
            ques: ques
          })
        }
      },
      // 刷新页面
      init: function (res, pageData) {
        this.questions = [];
        this.pageData.blocks = [];
        pageData.question_boxs.forEach((item, index) => {
          pageData.parts.forEach((item1, index1) => {
            item1.questions && item1.questions.forEach((item2, index2) => {
              if (item.id == item2.id) {
                item['title'] = item1.title;
                item['number'] = item2.number
              }
            })
          })
        })
        let cat = {};
        let category = pageData.category || {};
        category.catalog_id = this.catalog_id;
        this.pageTitle = pageData.title;
        for (let id in pageData.question_boxs) {
          const item = pageData.question_boxs[id];
          item.category = category;
          const ques = this.formatQuesData(item);
          if (!cat[ques.title]) {
            cat[ques.title] = {
              name: ques.title,
              number: ques.number,
              quesArr: [ques]
            }
          } else {
            cat[ques.title].quesArr.push(ques)

          }
        }
        for (let k in cat) {
          this.pageDataCache.blocks.push(cat[k])
        }
        this.filter_swith();

        // 分类排序
        // this.pageData.blocks.sort(function (item1,item2) {
        //         return item1.forderId>item2.forderId?1:-1
        // });
      },
      refreshData: async function () {
        const [resp] = await ajax.all([
          ajax.post('/assign/listenSpeakPaperContent', this.paperparams),
          Cart.getCardInfo()
        ]);
        if (resp.data.message == 'ok') {
          this.init(resp, resp.data.data)
          this.success = 'ok';
        } else {
          this.success = 'fail';
        }
      }
    },
    created: async function () {
      let params = getInitParams();
      this.paperparams = {
        paper_id: params.paper_id,
        region_id: params.region_id || '',
        grade_id: params.grade_id || '',
        term_id: params.term_id || '',
        is_filter: 1
      };
      // 加载打点
      sendLog(log.module.m_listenRead, log.op.ls_detail_load, {s0: 'english', s1: '套卷'});
      this.catalog_id = params.catalog_id || '';
      await this.refreshData();
      this.isloaded = true;
      Bus.$on('refreshCart', function () {
        this.refreshCart(true);
      }.bind(this));
      Bus.$on('updateCart', function () {
        this.refreshCart(false);
      }.bind(this));
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .container {
    max-width: 750px;
    margin: 0 auto;
    font-size: 0.28rem;
    min-height: 100%;
    overflow-scrolling: touch;
    -webkit-overflow-scrolling: touch;
    .scoller {
      overflow-scrolling: touch;
      -webkit-overflow-scrolling: touch;
    }
  }

  .question-container {
    .title {
      height: 0.64rem;
      line-height: 0.64rem;
      font-size: 0.28rem;
      color: #58595E;
      padding-left: 0.4rem;
    }
    .box {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .box {
    margin-bottom: 0.2rem;
    width: 100%;
  }

  .seleWarp {
    height: 1rem;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  .fixed-top {
    position: fixed !important;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 9999;
  }

  .card23 {
    background: #FFFFFF;
    padding: 0.3rem 0.4rem;
    font-size: 0.28rem;
    position: relative;
    color: #58595E;
    width: 100%;
    &:after {
      content: '';
      height: 0.02rem;
      background: #E5E5E5;
      width: 7.5rem;
      position: absolute;
      left: 0;
      bottom: 0;
      transform: scaleY(.5);
    }
    .btn {
      position: absolute;
      top: 0.22rem;
      right: 0.32rem;
      background: rgba(0, 122, 255, 0.05);
      border: 0.02rem solid #007AFF;
      border-radius: 2rem;
      padding: 0 0.26rem;
      font-size: 0.28rem;
      color: #007AFF;
      font-family: PingFangSC-Regular;
      text-align: center;
      line-height: 0.52rem;
      cursor: pointer;
    }
    .btn.remove {
      background: #007AFF;
      border-radius: 2rem;
      color: #fff;
    }
  }

  .papertitle {
    padding: 0.24rem 0.4rem 0.24rem 0.4rem;
    font-size: 0.44rem;
    background: #FFFFFF;
    position: relative;
    display: block;
    p {
      font-family: PingFangSC-Medium;
      color: #58595E;
      display: -webkit-box;
      word-break: break-all;
      line-height: 0.66rem;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  .filterBar {
    height: 1rem;
    width: 7.5rem;
    background-color: #fff;
    position: relative;
    &:after {
      content: '';
      height: 0.02rem;
      background: #E5E5E5;
      width: 7.5rem;
      position: absolute;
      left: 0;
      bottom: 0;
      transform: scaleY(.5);
    }
  }

  .switch {
    line-height: 1rem;
    padding-right: .42rem;
    color: #58595E;
    text-align: right;
    max-width: 750px;
    font-size: 0.28rem;
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
        content: '';
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
        border-color: #007AFF;
        box-shadow: #007AFF 0 0 0 16px inset;
        background-color: #007AFF;
        &:before {
          left: 0.32rem;
        }
      }
    }
  }
</style>
