<template>
    <div>
        <div class="rightContent">
            <cityTem :isShowselect="true"
                     ref="citytemp"
                     @zqLoadList="nextInit"></cityTem>
            <tjcontent ref="tjpaper"></tjcontent>
        </div>
    </div>
</template>
<script>
    import tjcontent from './lsp_tjcontent.vue'
    import Bus from '../../marvel/bus.js'
    import cityTem from './cityTem.vue'
    export default {
        name: "lspPaper", //听说套卷
        data(){
            return{
                params:{},
                islss:false
            }
        },
        components:{
            tjcontent,
            cityTem
        },
        methods :{
            init:async function() {
               await this.$refs.citytemp.init(this.islss);
                await this.nextInit();
            },
            nextInit:async function (){
                await this.$refs.tjpaper.init(this.$refs.citytemp.params)
            }
        },
        created () {
            Bus.$on('tjlistLoad',()=>{
                this.nextInit()
            })
        },
        beforeDestroy(){
            Bus.$off('tjlistLoad', this.nextInit())
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss"  type="text/css">
   .topWarp{
       padding: 20px;
       background: #FFFFFF;
       border: 1px solid #d6dee3;
       border-bottom: 0;
   }
</style>
<style scoped lang="scss" rel="stylesheet/scss" type="text/css">
    .rightContent{
        border: 1px solid #d6dee3;
        background: #FFFFFF;
        min-height: 700px;
        padding: 20px;
    }
</style>
