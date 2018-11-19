<template>
  <div class="m-footer">
    <div class="m-inner">
      <div class="m-left w-fl-left">
        <div class="copyright">
          <p>Copyright © 2011-2018 Yiqizuoye Corporation. All Rights Reserved.</p>
          <p>ICP证沪B2-20150026 沪ICP备13031855号-2 <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502032354" target="_blank" style="color:#999"><img src="https://cdn.17zuoye.com/static/project/icp-beian.png" style="display: inline-block;vertical-align: middle;">京公网安备 11010502032354号</a></p>
        </div>
        <div class="link">
          <a class="spare-icon spare-weibo" href="http://weibo.com/yiqizuoye" target="_blank" title="微博"></a>
        </div>
      </div>
      <div class="m-foot-link w-fl-right">
        <div class="m-left w-fl-left">
          <a :href='wwwbaseURL+"/help/aboutus.vpage"' target="_blank">关于我们</a>
          <a :href='wwwbaseURL+"/help/uservoice.vpage"' target="_blank">用户声音</a>
          <a :href='wwwbaseURL+"/help/kf/junior.vpage"' target="_blank">帮助中心</a>
          <a :href='wwwbaseURL+"/help/serviceagreement.vpage?agreement=1"' target="_blank">用户协议</a>
        </div>
        <div class="m-left w-fl-left">
          <a :href='wwwbaseURL+"/help/news/index.vpage"' target="_blank">新闻中心</a>
          <a :href='wwwbaseURL+"/help/jobs.vpage"' target="_blank">诚聘英才</a>
          <a :href='wwwbaseURL+"/project/educationsubject/list.vpage"' target="_blank">课题相关</a>
          <a :href='wwwbaseURL+"/help/privacyprotection.vpage"' target="_blank">隐私保护</a>
          <!--                        <a href="http://help.17zuoye.com" target="_blank">帮助</a>-->
        </div>
        <!--                    <div class="m-code">-->
        <!--                        <p class="c-image"></p>-->
        <!--                        <p class="c-title">关注我们</p>-->
        <!--                    </div>-->
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'mfooter',
    data () {
      return {
        zxbaseURL:window.zxbaseURL,
        wwwbaseURL:window.wwwbaseURL,
      }
    },
    created:function () {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /*m-footer*/
  .m-footer, .m-footer .m-inner{ clear: both; background-color: #fff; height: 200px;}
  .m-footer { border-top: 2px solid #3780c5;}
  .m-footer .m-inner{ width: 1000px; margin: 0 auto; overflow: hidden;}
  .m-footer .copyright{ color: #b9b9b9; font-size: 12px; margin-top: 50px;}
  .m-footer .link{ margin-top: 8px;}
  .m-footer .link .spare-icon{ background: url("../../assets/img/teacher/m-icon-share.png") no-repeat 500px 500px; display: inline-block; width: 39px; height: 38px; margin-right:20px;}
  .m-footer .link .spare-icon:hover{ background-image: url(../../assets/img/teacher/m-icon-share-blue.png)}
  .m-footer .link .spare-weibo{ background-position: 0 0;}
  .m-footer .link .spare-rr{background-position: -62px 0;}
  .m-footer .link .spare-qq{background-position: -124px 0;}
  .m-footer .link .spare-wx{background-position: -185px 0;}
  .m-footer .link .spare-qzone{background-position: -248px 0;}

  /*m-foot-link*/
  .m-footer .m-foot-link { margin-top: 45px; width: 350px;}
  .m-footer .m-foot-link h3{ color: #000; font-size: 16px; height: 25px; padding-left: 10px;}
  .m-footer .m-foot-link a{ display: block; color: #666; line-height: 26px; font-size: 14px;}
  .m-footer .m-foot-link a:hover{ color: #189cfb;}
  .m-footer .m-foot-link .w-fl-left{ width: 120px; }
  .m-footer .m-foot-link .m-code { float: right; width: 96px;}
  .m-footer .m-foot-link .m-code .c-image{ background: url(../../assets/img/pc-weixin.png) no-repeat; width: 90px; height: 90px; margin: 0 auto;}
  .m-footer .m-foot-link .m-code .c-title{ color: #666; text-align: center; line-height: 35px; font-size: 12px;}


</style>
