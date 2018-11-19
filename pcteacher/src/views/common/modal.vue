<template>
  <div class="jqibox" v-if="isshow">
    <div class="jqifade"></div>
    <div class="jqi" style="position: absolute; top: 50%; left: 50%;  z-index: 1000; transform: translate(-50%,-50%);max-width: 90%;">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import {bodyNoScroll} from '../../utils/bodyNoScroll.js'
  export default {
    name: 'modal',
    props:['isshow'],
    data () {
      return{

      }
    },
    watch:{
      isshow:function (val) {
        if(val){
          bodyNoScroll(true)
        }else{
          bodyNoScroll(false)
        }
      }
    },
    created:function () {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .jqibox{
    position: fixed; height: 100%; width: 100%; top: 0; left: 0; right: 0; bottom: 0; z-index: 999;
  }
  .jqifade {
    background-color: #777777;
    position: fixed; height: 100%; width: 100%; top: 0; left: 0; right: 0; bottom: 0; z-index: 999; opacity: 0.6;
  }

</style>
