<template>
  <img v-if="src" :src="lazysrc"/>
  <div v-else v-html="lazyhtml"></div>
</template>
<script>
  import nonepng from './assets/img/none.png';
  var list = []
  var running = false;
  var lazyFuc = function (e) {

    if (running || list.length == 0) {
      return;
    }
    running = true;
    var windowHeight = document.documentElement.clientHeight || window.innerHeight;
    var windowWidth = document.documentElement.clientWidth || window.innerWidth;
    var temp = []
    for (var i = 0; i < list.length; i++) {
      var obj = list[i].$el.getBoundingClientRect();
      if ((obj.top < windowHeight + 320) && (obj.left < windowWidth)) {
        list[i].isShow = true
      }
      if (!list[i].isShow) {
        temp.push(list[i])
      }
    }
    list = temp;
    running = false;
  }

  window.addEventListener('scroll', lazyFuc);
  window.addEventListener('touchstart', lazyFuc);
  window.addEventListener('touchmove', lazyFuc);
  window.addEventListener('touchend', lazyFuc);


  var cache = [];
  export default {
    name: 'mvImg',
    data: function () {
      return {
        isShow: false
      }
    },
    mounted: function () {
      if (this.isShow) {
        return;
      }
      list.push(this);
      var windowHeight = document.documentElement.clientHeight || window.innerHeight;
      var windowWidth = document.documentElement.clientWidth || window.innerWidth;
      var obj = this.$el.getBoundingClientRect();
      if ((obj.top < windowHeight) && (obj.left < windowWidth + 100)) {
        this.isShow = true;
      }
    },
    computed: {
      lazyhtml() {

        //img标签要把src取出来

        if(!this.isShow) {
          return this.html.replace(/src *= *(["'])([^"]*)\1/g,'src=$1'+nonepng+'$1')
        }
        else {
          return this.html;
        }

      },
      lazysrc() {
        if (cache.indexOf(this.src) > -1) {
          return this.src;
        }
        if (this.isShow) {
          cache.push(this.src);
          return this.src;
        } else {
          return nonepng;
        }
      }
    },

    props: {
      html:{
        type: String,
        default: ''
      },
      src: {
        type: String,
        default: ''
      }
    }
  };
</script>

