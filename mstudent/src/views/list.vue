<template>
  <div class="hello">
    <h3>最近更新时间：{{buildTime}}</h3>
    <h2>venus</h2>
    <ul class="list">
      <li>
        <a href="/mstudent/demo.html?type=all" target="_blank">demo</a>
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
