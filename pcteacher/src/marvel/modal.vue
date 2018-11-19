<template>
  <div id="servers">
    <component v-for="name in modalcomponent" :is="'mv-'+name" :key="name"></component>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Bus from './bus';

  /*
    增加服务的接口
  * */
  Bus.modalComponent = [];
  Bus.addModalComponent = function (model) {
    if (Bus.modalComponent.indexOf(model.name) == -1) {
      Bus.modalComponent.push(model.name)
      Vue.component("mv-" + model.name, model);
    }
  }
  export default {
    name: 'modal',
    data: function () {
      return {
        "modalcomponent": Bus.modalComponent
      }
    },

    props: {},
  };
</script>
