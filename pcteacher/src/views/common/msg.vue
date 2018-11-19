<template>
    <div class="msg">
            <div class="card">
                <div class="defaultEmpty" v-if="emptyType.type==1">
                    <div class="img"></div>
                    <p class="text">{{emptyType.text || '暂无满足条件的题目'}}</p>
                </div>
            </div>
    </div>
</template>

<script>

        export default {
                name: "msg",
                props:['emptyType']
        }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
    .msg{
        width: 100%;
        height: 100%;
        .card{
            width: 100%;
            position: relative;
            .defaultEmpty{
                position: absolute;
                width: 200px;
                text-align: center;
                top:112px;
                left: 50%;
                margin-left: -100px;
                .img{
                    width:68px ;
                    height: 60px;
                    background: url("../../assets/img/msg/empty.png") no-repeat center center;
                    background-size: cover;
                    margin: 0 auto;
                }
                .text{
                    font-size: 14px;
                    color: #9B9B9B;
                    margin-top: 14px;
                }
            }
        }
    }
</style>