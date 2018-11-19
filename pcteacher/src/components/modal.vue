<template>
  <div class="jqibox" v-if="isshow">
    <div class="jqifade"></div>
    <div class="jqi"
         style="position: absolute; top: 50%; left: 50%;  z-index: 100; transform: translate(-50%,-50%);max-width: 90%;">
      <form action="#" class="jqiform">
        <div class="jqiclose" @click="close">×</div>
        <div class="jqistates">
          <div class="jqistate" data-jqi-name="state0" style="">
            <div class="jqiarrow" style=""></div>
            <div class="lead jqititle ">
              <slot name="title"></slot>
            </div>
            <div class="jqimessage ">
              <slot name="content"></slot>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {bodyNoScroll} from '../utils/bodyNoScroll.js'

  export default {
    name: 'modal',
    props: ['isshow'],
    data() {
      return {}
    },
    watch: {
      isshow: function (val) {
        if (val) {
          bodyNoScroll(true)
        } else {
          bodyNoScroll(false)
        }
      }
    },
    created: function () {

    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .jqibox {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
  }

  .jqifade {
    background-color: #777777;
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    opacity: 0.6;
  }

  /*popup - box*/
  div.jqi {
    max-width: 90%;
    background-color: #ffffff;
    text-align: left;
    /*border-radius: 5px;*/
    padding: 0;
    border: none;
    font: 14px/100% "微软雅黑", "Microsoft YaHei", arial;
  }

  div.jqi .jqiclose {
    cursor: pointer;
    font-size: 28px;
    font-weight: normal;
    color: #000;
    border-left: 1px solid #dae6ee;
    padding: 0;
    height: 46px;
    line-height: 40px;
    width: 46px;
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
    _line-height: 48px;
    overflow: hidden;
  }

  div.jqi .jqistates {
    float: none;
  }

  .jqi .jqiarrow {
    position: absolute;
    height: 0;
    width: 0;
    line-height: 0;
    font-size: 0;
    border: solid 10px transparent;
  }

  div.jqi .jqititle {
    color: #383a4b;
    padding: 13px 0 13px 20px;
    font-size: 18px;
    border-color: #dae6ee;
    margin-bottom: 30px;
    line-height: 20px;
    border-bottom: solid 1px #eeeeee;
  }

  div.jqi .jqimessage {
    line-height: 20px;
    color: #444444;
    padding: 0;
    overflow: visible;
  }

  .w-btn {
    background-color: #189cfb;
    border: 1px solid #0979ca;
    color: #fff;
    display: inline-block;
    padding: 17px 0;
    text-decoration: none;
    width: 166px;
    text-align: center;
    font: 18px/1.125 "微软雅黑", "Microsoft YaHei", Arial;
    vertical-align: middle;
    border-radius: 2px;
  }

  .w-btn-cyan, .w-btn-green {
    background-color: #1abc9c;
    border-color: #08977b;
  }

  .w-btn-small {
    padding: 12px 0;
    width: 155px;
    font-size: 14px;
  }

  .w-magT-20 {
    margin-top: 20px;
  }

  .w-magR-5 {
    margin-right: 5px;
  }

  .w-checkbox {
    background: url(../assets/img/teacher/w-checkbox_new.png) no-repeat;
    width: 13px;
    height: 13px;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }

  .w-checkbox {
    background-position: -15px 0;
  }

  .w-checkbox-current, .active .w-checkbox, .w-checkbox-current .w-checkbox {
    background-position: -15px -17px;
    _margin-top: -1px;
  }
</style>
