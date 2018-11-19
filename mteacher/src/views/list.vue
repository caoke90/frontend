<template>
  <div class="hello">
    <h3>最近更新时间：{{buildTime}}</h3>
    <h2>同步模块</h2>
    <ul class="list">
      <li>
        <a href="/mteacher/examDemo.html?type=all" target="_blank">1、所有题目</a>
      </li>
      <li>
        <a href="/mteacher/tcbag.html?id=OCN_02418633236&bk_id=BK_20300001481320&bkc_id=BKC_20300076261886&is_word_package=1" target="_blank">2、题包1名称页面</a>
      </li>
      <li>
        <a href="/mteacher/tcbag.html?id=OCN_02406415462&bk_id=BK_20300001481320&bkc_id=BKC_20300076261886&is_word_package=0" target="_blank">3、题包2名称页面</a>
      </li>
      <li>
        <a href="/mteacher/tcbigbag.html?question_ids=[]&bk_id=BK_20300001481320&bkc_id=BKC_20300076261886&package_type=REVIEW_ORAL" target="_blank">4、大数据题包</a>
      </li>
      <li>
        <a href="/mteacher/tcpaper.html?paper_id=BKC_20300076261886&bk_id=BK_20300001481320&bkc_id=BKC_20300076261886" target="_blank">5、套卷题包</a>
      </li>
      <li>
        <a href="/mteacher/tcpaper.html?paper_id=P_20300076736251-2&bk_id=BK_20300000987708&bkc_id=BKC_20300054754516" target="_blank">6、单元套卷详情页面</a>
      </li>
      <li>
        <a href="/mteacher/tcques.html?bk_id=BK_20300001480836&unit_id=BKC_20300076255281&bkc_id=BKC_20300076255281&class_level=8&package_type=REVIEW_ORAL" target="_blank">6、题库页面</a>
      </li>
      <li>
        <a href="/mteacher/preview.html" target="_blank">7、练习预览页面</a>
      </li>
    </ul>
    <h2>听说专项</h2>
    <ul class="list">
      <li>
        <a href="/mteacher/lssdetail.html?region_id=110000&grade_id=8&subtype_id=203000001&subtype_id_type=1" target="_blank">1、听说专项</a>
      </li>
      <li>
        <a href="/mteacher/lspdetail.html" target="_blank">2、听说套卷</a>
      </li>
    </ul>
      <h2>高频错题</h2>
      <ul class="list">
          <li>
              <a href="/mteacher/frequentWrongList.html?bk_id=BK_20300001481320&bkc_id=BKC_20300076261886&unit_id=BKC_20300076255281" target="_blank">1.高频错题题包班级列表</a>
          </li>
          <li>
              <a href="/mteacher/frequentWrongQuestion.html" target="_blank">2.高频错题题包详情</a>
          </li>
      </ul>
    <h2>复习专区</h2>
    <ul class="list">
      <li>
        <a href="/mteacher/questionTypeDetail.html?region_id=110000&grade_id=8&subtype_id=203000001&subtype_id_type=1&title='听句子选答语言'&type=QUESTION_TYPE" target="_blank">1、复习专区-题型专区</a>
      </li>
      <li>
        <a href="/mteacher/feedback.html" target="_blank">2、打分反馈</a>
      </li>
      <li>
        <a href="/mteacher/reviewpdetail.html" target="_blank">3、复习套卷</a>
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
<style scoped lang="scss" type="text/css" rel="stylesheet/scss">
  .hello{
    max-width:750px;
    margin: 0 auto;
    color: #666;
    font-size: 0.28rem;
    padding:0 0.4rem;
    h2{
        font-size:0.4rem ;
        margin: 0.2rem 0;
    }
  }
  .list{
    font-size: 0.32rem;
    line-height: 0.3rem;
  }
</style>
