<template>
    <div class="loading" v-if="isShow">
        <span class="loading-image"></span>
    </div>
</template>
<script>
    import Bus from '../bus';
    export default {
        data: function () {
            return {
              isShow:false
            }
        },
        name: 'loading',
        computed: {},
      created() {
        Bus.$on('loading', (show) => {
          this.isShow=show
        });
      },
    }
</script>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
    .loading{
        width: 100%;
        height: 100%;
        position: fixed;
        background: #f5f6f7;
        z-index: 999;
        top: 0;
        left: 0;
        &-image {
            position: absolute;
            background: url('../assets/img/loading.gif') 0 0/100% 100% no-repeat;
            top: 50%;
            left: 50%;
            width: 2.24rem;
            height: 2.1rem;
            transform: translate(-50%, -50%);
        }
    }
</style>
