<template>
    <div class="cotWarp">
        <div class="zqTop">
            <cityTem :isShowselect="false"   ref="citytemp2"
                     @zqLoadcontent="nextInit"></cityTem>
            <div class="questiontpls">
                <subject @changeSubjectType="changeSubjectType" ref="subjectTemp"></subject>
            </div>
        </div>
        <div>
            <zqcontent  ref="zqloadPage"></zqcontent>
        </div>
    </div>
</template>
<script>
    import subject from './lss_subject.vue'
    import cityTem from './cityTem.vue'
    import zqcontent from './lss_zqcontent.vue'
    export default {
        name: "lssPaper",//听说专区,
        porps:['isShowselect'],
        data (){
            return {
                params:'',
                islss:true
            }
        },
        components:{
            subject,
            cityTem,
            zqcontent
        },
        methods:{
            init:async function (){
                await this.$refs.citytemp2.init(this.islss);
                this.params=this.$refs.citytemp2.params;
                await this.nextInit();
            },
            nextInit:async function (){
                await this.$refs.subjectTemp.init(this.$refs.citytemp2.params);
                await this.$refs.zqloadPage.init(this.$refs.subjectTemp.params);
            },
            changeSubjectType:function(params){
                this.params.subtype_id=params.subtype_id;
                this.params.subtype_id_type=params.subtype_id_type;
                this.params.list_type=params.list_type;
                this.$refs.zqloadPage.init(this.params);
            }
        }
    }
</script>
<style scoped rel="stylesheet/scss" type="text/css" lang="scss">
    .zqTop{
        border: 1px solid #d6dee3;
        background: #FFFFFF;
        padding:20px 20px 10px 20px;
        .questiontpls{
            margin-top: 20px;
        }
    }
</style>
