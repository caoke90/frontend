<template>
  <div class="card" :class="cardclass">
    <div ref="card">
      <slot></slot>
    </div>
    <div class="btn" v-if="need&&!out">
      <div class="titleback"><span style="display: inline-block" @click="feedback">题目反馈</span></div>
      <div class="see" @click="toggle">{{out?'收起':'查看全部'}}<span class="icon" :class="out?'upArrow':'downArrow'"></span>
      </div>
    </div>
  </div>

</template>

<script>
  import {questionFeedback} from '../../common/js/external/teacher';

  // 屏幕宽度
  var win_width,height,btnheight,pheight
  export default {
    data: function () {
      return {
        need: false,
        out: 0,
        item:null,
        hideItems:[],
      }
    },
    props: ['card', 'height'],
    name: 'toggle',
    computed: {
      cardclass: function () {
        if (this.need) {
          if (this.out) {
            if(this.item) {
              this.item.classList.remove('visibleNone')
            }
            this.hideItems.forEach(function (item) {
              item.classList.remove("hideItem")
            })
            return 'out';
          } else {
            if(this.item) {
              this.item=this.findDom(this.$refs.card)
              if(this.item){
                this.item.classList.add('visibleNone')
              }
            }
            this.hideItems.forEach(function (item) {
              item.classList.add("hideItem")
            })
            return 'in';
          }
        } else {
          return '';
        }

      }
    },
    methods: {
      toggle: function () {
        this.out = !this.out;
      },
      feedback() {
        questionFeedback({question_id: this.card.id});
      },
      findHideDom:function(dom){
        if(dom.children.length&&dom.offsetHeight>pheight){
          for(let i=0;i<dom.children.length;i++){
            let item =dom.children[i]
            if(item.offsetTop<height-btnheight&&item.offsetTop+item.offsetHeight>height-btnheight){
              this.findHideDom(item)
            }
            if(item.offsetTop>height-btnheight){
              this.hideItems.push(item)
            }
          }
        }else{
          if(dom.offsetTop>height-btnheight){
            this.hideItems.push(dom)
          }
        }
      },
      findDom:function(dom){
        if(dom.children.length&&dom.offsetHeight>pheight){
          for(let i=0;i<dom.children.length;i++){
            let item =dom.children[i]
            if(item.offsetTop<height-btnheight&&item.offsetTop+item.offsetHeight>height-btnheight){
              return this.findDom(item)
            }
          }
        }else{
          if(dom.offsetTop<height-btnheight&&dom.offsetTop+dom.offsetHeight>height-btnheight){
            return dom;
          }
        }
      },
    },
    mounted: function () {
      win_width = window.innerWidth > 750 ? 750 : window.innerWidth;
      height = parseInt(460 * win_width / 750);
      btnheight = parseInt(134 * win_width / 750);
      pheight = parseInt(100 * win_width / 750);

      if (this.$refs.card.offsetHeight > height) {
        this.need = true;
        this.item=this.findDom(this.$refs.card)
        if(this.item){
          this.item.classList.add("visibleNone")
        }
        this.findHideDom(this.$refs.card)
        this.hideItems.forEach(function (item) {
          item.classList.add("hideItem")
        })
      }
    }
  };

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .visibleNone{
    opacity: .6;
  }
  .hideItem{
    visibility: hidden;
  }
</style>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>

  .card {
    position: relative;

    .btn {
      padding: 0 0.4rem;
      position: absolute;
      width: 100%;
      bottom: -0.02rem;
      left: 0;
      background: #FFFFFF;
      height: 1.34rem;
      overflow: hidden;
      .icon {
        display: inline-block;
        width: 0.22rem;
        height: 0.22rem;
        margin-left: 0.09rem;
      }
      .upArrow {
        vertical-align: -0.06rem;
        background: url('../../assets/img/upArrow.png') no-repeat;
        background-size: 0.22rem 0.22rem;
      }
      .downArrow {
        vertical-align: 0.02rem;
        background: url('../../assets/img/downArrow.png') no-repeat;
        background-size: 0.22rem 0.22rem;
      }
      .see {
        height: 0.88rem;
        font-size: 0.28rem;
        color: #58595E;
        text-align: center;
        line-height: 0.88rem;
      }
      .titleback {
        text-align: right;
        font-size: 0.24rem;
        color: #9D9FA1;
        background: #fff;
        padding-top: 0.1rem;
        line-height: 0.36rem;
        a {
          color: #9D9FA1;
        }
      }
    }
  }

  .card.out {
    padding-bottom: 0rem;
  }

  .card.in {
    padding-bottom: 0.44rem;
    max-height: 4.6rem;
    overflow: hidden;
  }
</style>
