<template>
  <input type="file" value="" style="display:none;" @change="change($event)"/>
</template>
<script>
  import Bus from '../bus';

  export default {
    name: "file",
    data() {
      return {
        callback: null
      };
    },
    methods: {
      change: function (e) {
        var self = this;
        var file = this.$el.files[0];

        self.callback(file)
      }

    },
    created() {
      Bus.$on('getFile', (callback) => {
        this.$el.click();
        this.callback = callback;
      });
    },
    components: {}
  };

</script>
<style lang="scss">

</style>
