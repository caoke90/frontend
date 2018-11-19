<template>
  <div class="hello">
    <h3>最近更新时间：{{buildTime}}</h3>
    <h2>dev.list.html 列表页</h2>
    <ul class="list">
      <li>
        <a href="/pcteacher/examDemo.html?type=all" target="_blank">所有题目</a>
      </li>
      <li>
        <a href="/pcteacher/assign.html" target="_blank">推荐练习-同步</a>
      </li>
      <li>
        <a href="/pcteacher/paperdetail.html" target="_blank">单元套卷详情-同步</a>
      </li>
      <li>
        <a href="/pcteacher/preview.html" target="_blank">练习预览</a>
      </li>
    </ul>

  </div>
</template>

<script>


  export default {
    name: 'HelloWorld',
    data () {
      return {
        buildTime:process.env.buildTime
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    width: 600px;
    margin: 0 auto;
    color: #666;
    font-size: 0.28rem;
  }
  .list{
    font-size: 22px;
    line-height: 30px;
  }
</style>
