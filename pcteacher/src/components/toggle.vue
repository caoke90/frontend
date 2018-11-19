<template>
    <div class="togglewarp">
        <div>
            <slot></slot>
        </div>
        <div class="btn">
            <div class="see">更多<span class="w-icon-arrow w-icon-arrow-lBotB"></span></div>
        </div>
    </div>
</template>

<script>
        export default {
                name: "toggle",
                data(){
                        return{

                        }
                }
        }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/css" scoped>
    .togglewarp{
        position: relative;
        .btn{
            position: absolute;
            bottom:-30px;
            left: 0;
            width: 100%;
            .see{
                text-align: center;
                font-size: 14px;
                color: #159CFC;
                cursor:pointer;
                span{
                    vertical-align: middle;
                    margin-top: 3px;
                }
            }
        }
    }
</style>