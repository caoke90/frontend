<template>
    <div class="layer" ref="toast">
        <div class="layerWarp fadeIn">
            <div class="img">
                <img src="../../assets/img/msg/success.png">
            </div>
            <p>{{card.message}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "successToast",
        props: ['card']
    }
</script>

<style scoped rel="stylesheet/scss" type="text/css" lang="scss">
    .fadeIn{
        -webkit-animation:fadeIn 1s .2s ease both;
        -moz-animation:fadeIn 1s .2s ease both;}
    @-webkit-keyframes fadeIn{
        0%{opacity:0}
        50%{opacity:0.8}
        100%{opacity:1}
    }
    @-moz-keyframes fadeIn{
        0%{opacity:0}
        50%{opacity:0.8}
        100%{opacity:1}
    }
    .dn{
        display: none;
    }
    .layer{
        width: 100%;
        height: 100%;
        .layerWarp{
            width: 2.2rem;
            height: 2.2rem;
            background:rgba(51, 51, 51,0.9);
            transform: translate(-50%,-50%);
            border-radius: 3px;
            text-align: center;
            line-height: 2.2rem;
            position: absolute;
            top: 50%;
            left: 50%;
            p{
                font-size: 0.3rem;
                color: #FFFFFF;
                line-height:1;
                margin-top:0.8rem;
            }
            .img{
                margin: -0.1rem auto 0;
                width: 0.64rem;
                height: 0.64rem;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>