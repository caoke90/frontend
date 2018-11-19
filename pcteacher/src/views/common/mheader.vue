<template>
  <div class="m-header">
    <div class="m-inner">
      <div class="logo logo-back"><a :href='zxbaseURL+"/"' title="返回首页"></a></div>
      <div class="link ">
        <ul class="w-fl-left">
          <li>
            <div class="h-arrow"><span class="w-icon w-icon-arrow w-icon-arrow-blue"></span></div>
            <div class="title" style="width:130px">
              <a :href='wwwbaseURL+"/reward/index.vpage"' target="_blank"><span class="w-icon w-icon-10"></span><span class="w-icon-md">教学用品中心</span></a>
            </div>
          </li>
        </ul>
        <ul class="w-fl-right">
          <li class="v-menu-hover v-menu-click">
            <div class="h-arrow"><span class="w-icon w-icon-arrow w-icon-arrow-blue"></span></div>
            <div class="title">
              <a> <span class="w-icon-2wicon"></span><span class="w-icon-md w-icon-thapp">老师APP</span></a>
              <div class="link-wbox"><div class="link-wtriangle"></div><div class="link-wbg"><img src="../../assets/img/teacher/appteacher.png"><p>手机扫描二维码下载</p></div></div>
            </div>
          </li>
          <li class="v-menu-hover v-menu-click">
            <div class="h-arrow"><span class="w-icon w-icon-arrow w-icon-arrow-blue"></span></div>
            <div class="title">
              <a :href='centerbaseURL+"/teacher/center/index.vpage#/teacher/message/index.vpage"'><span class="w-icon w-icon-7"></span><span class="w-icon-md">消息</span></a>
            </div>
            <div class="info-bar" v-show="user.mesgCount>0">
              <span class="v-msg-count w-icon-arrow w-icon-redInfo">{{user.mesgCount}}</span>
            </div>
          </li>
          <li class="v-menu-hover pull-down" @mouseenter="showMenu" @mouseleave="showMenu">
            <div class="h-arrow"><span class="w-icon w-icon-arrow w-icon-arrow-blue"></span></div>
            <div class="title">
              <a href="javascript:void(0);"><span class="w-icon w-icon-8"></span><span class="w-icon-md" v-show="user.userName">{{user.userName[0]}}老师</span><span class="w-icon-arrow"></span></a>
            </div>
            <div class="select" v-if="isSelect">
              <a :href='centerbaseURL+"/teacher/center/index.vpage"'>个人中心</a>
              <a :href='wwwbaseURL+"/project/educationsubject/list.vpage"' target="_blank">课题相关</a>
              <a :href='wwwbaseURL+"/help/kf/junior.vpage"' target="_blank">帮助与支持</a>
              <a @click="pcClientDownload">PC客户端</a>
              <a :href='zxbaseURL+"/index/logout"' class="sign-out"><span class="w-icon-md">退出</span></a>
            </div>
          </li>

        </ul>

      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '../../marvel/bus.js'
  import ajax from '../../api/ajax.js'
  import sa from '../../utils/sensorsdata'
  export default {
    name: 'mheader',
    data () {
      return {
        wwwbaseURL:window.wwwbaseURL,
        zxbaseURL:window.zxbaseURL,
        centerbaseURL:window.centerbaseURL,
        isSelect: false,
        version: '1.0.0',
        /*loadUser*/
        user:{
          userName:'',
          mesgCount:0,
        },
      }
    },
    methods: {
      pcClientDownload:function() {
        var osVersion = this.detectOSVersion();
        if (osVersion>=6.1) {
          window.open("https://cdn.17zuoye.com/static/download/17zuoye_setup_gte7_20171207.exe")
        }
        else {
          alert("暂不支持您使用的操作系统。");
        }
      },

      detectOSVersion:function()
      {
        var osVersion = 0;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        if(isWin) {
          var osInfo = window.navigator.userAgent;
          var osVersionInfo = /.*\(Windows NT (\d+\.\d+).*/.exec(osInfo);
          if (osVersionInfo) {
            osVersion = parseFloat(osVersionInfo[1]);
          }
        }
        return osVersion;
      },
      showMenu: function(){
        this.isSelect = !this.isSelect;
      },
      sayHello: function(){
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
          var args = [
              '\n %c %c %c 17ZUOYE ' + this.version + ' - ✰ ' + 'Middle School' + ' ✰  %c ' + ' %c ' + ' http://www.17zuoye.com/  %c %c ♥%c♥%c♥ \n\n',
              'background: #ff66a5; padding:5px 0;',
              'background: #ff66a5; padding:5px 0;',
              'color: #ff66a5; background: #030307; padding:5px 0;',
              'background: #ff66a5; padding:5px 0;',
              'background: #ffc3dc; padding:5px 0;',
              'background: #ff66a5; padding:5px 0;',
              'color: #ff2424; background: #fff; padding:5px 0;',
              'color: #ff2424; background: #fff; padding:5px 0;',
              'color: #ff2424; background: #fff; padding:5px 0;'
          ];
	        window.console.log.apply(console, args); //jshint ignore:line
        } else if (window.console){
          window.console.log('17ZUOYE ' + this.version + ' - ' + 'Middle School' + ' - http://www.17zuoye.com/'); //jshint ignore:line
        }
      },
      // 加载完成
      init:async function () {
        const resp=await ajax.post('/pc/v1/assign/loadUser')
        this.user=Object.assign(this.user,resp.data.data);
        if(this.user.userId){
          sa.login(this.user.userId)
        }else{
          //无登录
          return;
        }

        // 用户信息存入全局对象
        window.appInfo.userId = this.user.userId;
      }
    },
    created:function () {
      Bus.mheader=this;
      this.sayHello();
      this.init()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /*m-header*/
  .m-header{ background-color: #fff; height: 60px; }
  .m-header .m-inner{ background-color: #fff; height: 59px;}
  .m-header{ position: relative; z-index: 99; border-bottom: 1px solid #d3d8df; min-width:1000px;}
  .m-header .m-inner{ width: 1000px; margin: 0 auto;}
  .m-header .logo{ background: url(../../assets/img/teacher/logo-new-2.png) no-repeat; width: 116px; height: 37px; float: left; margin: 11px 0 0 20px;}
  .m-header .logo-back{ width: 180px; }
  .m-header .logo a{ width: 100%; height: 100%; display: block;}
  .m-header .link{ margin: 0 0 0 200px;}
  .m-header .link li{ float: left; position: relative; width: 90px; text-align: center;}
  .m-header .link li .title {}
  .m-header .link li .title a{ color: #667284; display: block; width: 100%; padding: 21px 0 19px;}
  .m-header .link li .title a:hover{ color: #189cfb;}
  .m-header .link li .h-arrow{ background-color: #189cfb; width: 100%; font: 1px/4px arial; position: absolute; left: 0; top: 0; height: 4px; display: none;}
  .m-header .link li .h-arrow span{ position: absolute; left: 50%; top: 4px; margin: 0 0 0 -5px;}
  .m-header .link li .info-bar{ position: absolute; top: 8px; right: 6px;}
  .m-header .link .pull-down {}
  .m-header .link .pull-down .select{ position: absolute; background-color: #667284; width: 100px; left: 0; top: 59px;}
  .m-header .link .pull-down .select a{ color: #fff; display: block; padding: 18px 0; text-align: center; border-bottom: 1px solid #5d6675; font-size: 12px;}
  .m-header .link .pull-down .select a:hover {background-color: #556073; color: #189cfb;}
  .m-header .link .pull-down .select .sign-out{ background-color: #fa7252; border-bottom: none; }
  .m-header .link .pull-down .select .sign-out:hover{ background-color: #c94728; color: #fff;}
  .m-header .link .active .h-arrow .w-icon{ display: none;}
  .m-header .link .active .select, .m-header .link .active .h-arrow, .m-header .link .current .h-arrow{ display: block;}
  .m-header .link .current .h-arrow .w-icon{ display: block;}
  .m-header .link .t-inviteSendGold-menu, .m-header .link .t-callsToSend-menu{ margin-top: 5px;}

</style>
