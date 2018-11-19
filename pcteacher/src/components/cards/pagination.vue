<template>
    <div class="paginationwarp">
        <el-pagination
                background
                layout="prev, pager, next"
                :total="100"
        ></el-pagination>
    </div>
</template>

<script>
        export default {
                name: "pagination"
        }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss">
    .paginationwarp{
        .el-pager{
            li{
                background-color: #f5f8fb !important;
                font-size: 14px;
                color: #7F7E7E !important;
                font-weight: normal;
                &:hover{
                    background: #ebf0f4 !important;
                    color: #7F7E7E !important;
                }
            }
            .active{
                background: #159cfc !important;
                color: #FFFFFF !important;
                &:hover{
                    background: #159cfc !important;
                    color: #FFFFFF !important;
                }
            }
        }
    }
</style>