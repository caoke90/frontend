<template>
  <div class="container" v-if="isLoaded" :class="{ 'more': more, 'nomore': nomore}">
    <!-- success -->
    <template v-if="success === 'ok'">
      <div class="filterBar-wrap" v-show="allcardGroup.length!==0">
        <div class="filterBar">
          <div class="switch">
            过滤已使用
            <label><input class="mui-switch" @click="filter_swith()" type="checkbox" :checked="isFilter"></label>
          </div>
        </div>
      </div>
      <!-- scroller -->
      <scroller :data="cardGroup" @loadmore="next" style="padding-top: 1rem;">
        <div class="box" slot-scope="props">
          <question :question='props.item' :qindex="props.index" :bagtype="pageType"></question>
        </div>
      </scroller>

      <!-- empty -->
      <template v-if="cardGroup.length === 0">
        <msg :card="{ type: 'empty' , msg: this.msg}"></msg>
      </template>

      <div v-if="cardGroup.length&&!nomore" class="weui-loadmore">
        <i class="weui-loading"></i>
        <span class="weui-loadmore__tips">正在加载更多…</span>
      </div>
      <div v-if="nomore" class="weui-loadmore weui-loadmore_line">
        <span class="weui-loadmore__tips">没有更多了</span>
      </div>

    </template>
    <!-- error -->
    <template v-else>
      <msg :card="{ type: 'error' }"></msg>
    </template>
  </div>
</template>
<script>
  import ajax from '../api/ajax';
  import Bus from '../marvel/bus';

  import {sendLog} from '../common/js/logger';
  import log from '../common/js/utils/logConfig';
  // 网络异常
  import msg from '../components/cards/msg.vue';

  // 购物车
  import Cart from '../api/cart';
  import scroller from "../marvel/scroller";

  // 题目生成器
  import Question from '../models/question/Question';
  // util
  import {hget, vExtend} from '../utils/hobj';
  import {getInitParams, updateTitle} from '../common/js/external/index';


  export default {
    data() {
      return {
        more: false,
        success: '',
        nomore: false,
        cardGroup: [],
        allcardGroup: [],
        isLoaded: false,
        pageType: 'lssdetail',
        isFilter: false,
        msg: '本地化内容生产中，敬请期待～'
      }
    },
    components: {msg, scroller},
    methods: {
      filter_swith: function () {
        this.isFilter = !this.isFilter;
        if (!this.isFilter) {
          this.msg = '本地化内容生产中，敬请期待～';
          this.cardGroup = this.allcardGroup;
        } else {
          this.msg = '全部题目已使用';
          let arr = []
          this.allcardGroup.forEach(function (question) {
            if (!question.isUsed) {
              arr.push(question)
            }
          })
          this.cardGroup = arr;
        }
      },
      refreshData: async function () {
        let [content] = await ajax.all([
          ajax.post('/assign/listenSpeakSpecialContent', this.rparams),
          Cart.getCardInfo()
        ]);
        if (hget(content, 'data.result') === 'success') {
          let data = hget(content, 'data.data', {});
          let questionBoxs = data.question_boxs || [];
          let pageTitle = data.content_types || [];
          let category = data.category || {};
          let cardGroupTemp = [];
          pageTitle = pageTitle[0] || {};
          pageTitle = this.pageTitle || pageTitle.name || '';

          updateTitle(pageTitle);

          category.catalog_id = this.catalog_id;

          questionBoxs.length && questionBoxs.forEach((item) => {
            item.category = category;
            let itemTemp = new Question(item);
            itemTemp.selected = Cart.hasQuestion(itemTemp);
            cardGroupTemp.push(itemTemp);
          })

          this.pageInfo = data.page_info || {};
          this.cardGroup = [].concat(this.cardGroup, cardGroupTemp);
          this.allcardGroup = [].concat(this.allcardGroup, cardGroupTemp);

          this.success = 'ok';
        } else {
          this.success = 'faild';
        }
      },
      refreshCart: async function (refresh) {

        if (refresh) {
          await Cart.refresh();
        }
        this.allcardGroup.forEach((card) => {
          card.selected = Cart.hasQuestion(card);
        });
      },
      next: async function () {
        let sH = document.documentElement.scrollHeight;
        let cH = document.documentElement.clientHeight;
        if (!this.more) {
          ++this.rparams.page;
          if (this.pageInfo.total_page >= this.rparams.page) {
            this.more = true;
            await this.refreshData();
            this.more = false;
          } else if (sH > cH) {
            this.nomore = true;
          } else {

          }
        }
      }
    },
    created: async function () {
      let params = getInitParams();

      this.rparams = vExtend({
        page: 1,
        grade_id: '',
        page_size: 10,
        region_id: '',
        list_type: '',
        subtype_id: '',
        subtype_id_type: ''
      }, params);

      // 加载打点
      sendLog(log.module.m_listenRead, log.op.ls_detail_load, {s0: 'english', s1: '专项'});

      // 购题车用到
      this.catalog_id = params.catalog_id || '';

      // title
      this.pageTitle = params.title || '';
      await this.refreshData();
      this.isLoaded = true;

      Bus.$on('refreshCart', function () {
        this.refreshCart(true);
      }.bind(this));

      Bus.$on('updateCart', function () {
        this.refreshCart(false);
      }.bind(this));

    }
  }
</script>
<style lang="scss">
  .container {
    > .msg {
      position: absolute !important;
      height: calc(100% - 1.16rem); // .2rem + .96rem
      width: 100%;
      > .card {
        -webkit-transform: translate(-50%, -50%) !important;
        transform: translate(-50%, -50%) !important;
        top: 50% !important;
        left: 50%;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .container {
    max-width: 750px;
    margin: 0 auto;
    font-size: .28rem;
    // overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100vh;
    padding-top: .2rem;
    padding-bottom: .96rem;
    .wrapClass {
      div:last-child {
        .box {
          margin-bottom: 0;
        }
      }
    }
    &.nomore, &.more {
      padding-bottom: 0;
    }
    .box {
      margin-bottom: .2rem;
      .card {
        background: #FFFFFF;
        padding: .3rem .4rem;
        position: relative;
        font-size: .28rem;
        .btn {
          position: absolute;
          top: .22rem;
          right: .32rem;
          background: rgba(0, 122, 255, .05);
          border: .02rem solid #007AFF;
          border-radius: 2rem;
          padding: 0 .26rem;
          font-size: .28rem;
          color: #007AFF;
          font-family: PingFangSC-Regular;
          text-align: center;
          line-height: .52rem;
          cursor: pointer;
        }
        .btn.remove {
          background: #007AFF;
          border-radius: 2rem;
          color: #fff;
        }
      }
    }
    .nomore {
      position: relative;
      bottom: 0;
      width: 100%;
      margin: 0 auto;
      height: .96rem;
      line-height: .96rem;
      font-family: PingFangSC-Regular;
      font-size: .24rem;
      color: #9D9FA1;
      text-align: center;
      background: #f5f6f7;
      &:before, &:after {
        content: '';
        position: relative;
        height: .02rem;
        width: .8rem;
        display: inline-block;
        vertical-align: middle;
        background: #BABABA;
      }
    }
    .more {
      position: relative;
      bottom: 0;
      width: 100%;
      margin: 0 auto;
      height: .96rem;
      line-height: .96rem;
      font-family: PingFangSC-Regular;
      font-size: .24rem;
      color: #9D9FA1;
      text-align: center;
      background: #f5f6f7;
      img {
        height: .32rem;
        width: .32rem;
      }
      * {
        // display: inline-block;
        vertical-align: middle;
      }
    }
    .filterBar-wrap {
      height: 1rem;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
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
  }
</style>
