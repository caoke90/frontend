import sa from'sa-sdk-javascript';

let sa_project = {
  test:'default',
  staging:'default',
  production:'production',
};
sa.init({
  server_url: 'https://zxdr.17zuoye.com:8106/sa?project=' + (process.env.STAGE ? sa_project[process.env.STAGE] : 'default'),
  heatmap: {
    //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
    //需要 JSSDK 版本号大于 1.7
    clickmap:'default',
    //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
    //需要 JSSDK 版本号大于 1.9.1
    scroll_notice_map:'default'
  }
});
sa.quick('autoTrack');
export default sa;
