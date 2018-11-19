<template>
    <div class="container" v-if="status!=='loading'">
        <template v-if="status==='loaded'">
            <div>
                <div class="content">
                    <div class="list clearfix" v-for="(items,index) in cart_list" :key="readNum+index">
                        <p class="quesClass">{{items.content_types}}<span>(共{{items.question_num}}题)</span></p>
                        <div class="numWarp">
                            <span class="setIcon" @click="reduceCartNum(index)" :class="[ items.num==1 ? ' reduce':'reduceActive']"></span>
                            <span class="time">{{items.num}}<span>次</span></span>
                            <span class="setIcon" @click="addCartNum(index)" :class="[  items.num==5 ? 'unAdd':'add']"></span>
                        </div>
                    </div>
                </div>
                <div class="commitBtn">
                    <p>预计跟读需 {{oralTime}} 分钟，本次练习共 {{Math.ceil(totalTime/60)}} 分钟</p>
                    <button @click="setReadNum">确定</button>
                </div>
            </div>
        </template>
        <template v-else-if="status==='error'">
            <msg style="height: 5rem;" :card="{type:'error'}"></msg>
        </template>
        <template v-if="showToast">
            <Toast :card="{message:'设置成功'}"></Toast>
        </template>
    </div>
</template>

<script>
    import ajax from '../api/ajax';
    import Toast from '../components/cards/successToast.vue';
    import {updateTitle,showLoading} from '../common/js/external/index';
    import {sendLog} from '../common/js/logger';
    import {localStorageGet,localStorageRemove} from '../common/js/external/localStorage';
    document.body.addEventListener('touchstart', function () { });//为模拟h5 :active样式
    export default {
        name: "setReadNum",
        components:{
            Toast
        },
        data (){
            return {
                status:'loading',
                readNum:1,
                cacheSet:'',
                showToast:false,
                oralTime:null, //跟读时间
                totalTime:null, //练习时间
                cart_list: [],
            }
        },
        mounted() {

        },
        methods :{
            addCartNum:function (index) {
               if(this.cart_list[index].num>=5){
                   return false
               }
                this.readNum++;
                this.cart_list[index].num++;
                this.totalTime+=this.cart_list[index].duration;
                this.oralTime=this.getOraltime(this.cart_list);
            },
            reduceCartNum:function(index){
                let nums=this.cart_list[index].num;
                if(nums <= 1){
                    return false;
                }
                this.cart_list[index].num--;
                this.totalTime-=this.cart_list[index].duration;
                this.oralTime=this.getOraltime(this.cart_list);
                this.readNum--;
            },
            setReadNum:async function(){
                showLoading(true);
                let json ={};
                const vm =this;
                for( let k in this.cart_list){
                    json[k]={
                        num:this.cart_list[k].num
                    };
                    sendLog('','',{event:'onlineEn_SpeakAndRead_setRead',logData:{'content_type_2_name':this.cart_list[k].content_types,'numbers':this.cart_list[k].num}});
                }
                localStorageRemove('','duration');//清除缓存
                if(this.totalTime!=this.cacheSet){
                    const {data} = await ajax.post('/assign/changeFollowUpNum',{
                        followup_num:JSON.stringify(json)
                    })
                    showLoading(false)
                    if(data.result=="success"){
                        this.closeWebview();
                    }else{
                        console.log(data.message)
                    }
                }else{
                    this.closeWebview();
                }
            },
            closeWebview:function(){
                this.showToast=true;
                const vm =this;
                setTimeout(function () {
                    vm.showToast=false;
                    if (window.external && window.external.disMissView) {
                        window.external.disMissView();
                    }
                },1000)
            },
            refreshData:async function(){
                const [resp]=await ajax.all([
                    ajax.post('/cart/preview'),
                ]);
                if (resp.data.message == 'ok') {
                    this.status='loaded';
                    this.init(resp.data.data)
                }else{
                    this.status='error';
                }
            },
            getOraltime:function(followup_num){
                let oralTotaltime=null;
                for(let k in followup_num){
                    oralTotaltime +=followup_num[k].duration*followup_num[k].num;
                }
                return Math.ceil(oralTotaltime/60)
            },
            init:function (pageData) {
                this.cart_list=pageData.followup_num;
                this.totalTime=localStorageGet('','duration').value;
                this.cacheSet=localStorageGet('','duration').value;//缓存
                this.oralTime=this.getOraltime(pageData.followup_num);
            }
        },
        created: async function () {
            updateTitle('跟读次数设置');
            this.refreshData();
        }
    }
</script>

<style scoped rel="stylesheet/scss" type="text/css" lang="scss">
    .container{
        max-width: 750px;
        margin: 0 auto;
        font-size: 0.28rem;
        .content{
            width: 100%;
            background: #FFFFFF;
            .list{
                position: relative;
                height: 1.22rem;
                line-height: 1.22rem;
                margin-left:0.4rem;
                overflow:hidden;
                padding-right:0.4rem;
                -webkit-user-select:none;
                -moz-user-select:none;
                user-select:none;
                &:last-child{
                     position: static;
                 }
                &:after{
                     content: '';
                     height: 0.03rem;
                     background: #E5E5E5;
                     width: 7.5rem;
                     position: absolute;
                     left: 0;
                     bottom: 0;
                     transform:scaleY(.5);
                 }
                .quesClass{
                    float: left;
                    height: 100%;
                    color: #171717;
                    font-size:0.3rem;
                    span{
                        color: #9D9FA1;
                        margin-left: 0.1rem;
                    }
                }
                .numWarp{
                    float: right;
                    height: 100%;
                    .setIcon{
                        width: 0.48rem;
                        height: 0.48rem;
                        line-height: 0.4rem;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .reduce{
                        background:url('../assets/img/disableReduce.png') no-repeat;
                        background-size:contain;
                    }
                    .reduceActive{
                        background:url('../assets/img/reduce.png') no-repeat;
                        background-size:contain;
                    }
                    .time{
                        margin:0 0.2rem;
                        input{
                            display: inline-block;
                            width: 0.2rem;
                        }
                        span{
                            margin-left: 0.1rem;
                        }
                    }
                    .add{
                        background:url('../assets/img/add.png') no-repeat;
                        background-size:contain;
                    }
                    .unAdd{
                        background:url('../assets/img/disableAdd.png') no-repeat;
                        background-size:contain;
                    }
                }
            }
        }
        .commitBtn{
            max-width: 750px;
            margin: 0 auto;
            width:100%;
            transform: translate(-50%);
            -webkit-transform: translate(-50%);
            padding-bottom: 0.2rem;
            position: fixed;
            left:50%;
            bottom:0rem;
            background: #FFFFFF;
            text-align:center;
            p{
                padding:0.16rem 0;
                font-size: 0.28rem;
                color: #58595E;
            }
            button{
                width: 89%;
                border: none;
                outline: none;
                height: 0.8rem;
                line-height: 0.8rem;
                font-size: 0.32rem;
                color: #FFFFFF;
                background:#007AFF;
                text-align: center;
                border-radius: 30px;
                -webkit-user-select:none;
                -moz-user-select:none;
                user-select:none;
                &:active{
                     background: #0062D9;
                 }
            }
            .active{
                background: #0062D9;
            }
        }
    }
</style>