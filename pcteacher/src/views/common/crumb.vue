<template>
  <div class="w-breadcrumb">
    <ul v-for="item in navList">
      <template v-if="item.selectd">
        <li class="active">
          <a :href=item.url>{{item.name}}</a><span class="divider"> &gt; </span>
        </li>
      </template>
      <template v-else>
        <li>{{item.name}}</li>
      </template>
    </ul>
  </div>
</template>

<script>
  import Bus from '@/marvel/bus.js'
  import qs from 'qs'

  export default {
    name: 'crumb',
    props:['pageInfo'],
    data () {
      return {
        navList:[{name:"首页",selectd:true,url:""},{name:"发布练习",selectd:false}]
      }
    },
    created:function () {
      Bus.crumb = this;
      var tab = qs.parse(location.search.substr(1))['tab']
      if(qs.parse(this.pageInfo[1].url) != ''){
        switch(tab){
          case 'junior_review':
            this.pageInfo[1].name = '听说专区'
            this.pageInfo[1].url = '/pcteacher/assign.html?tab=junior_review'
            break;
          case 'entrance_exam_review':
            this.pageInfo[1].name = '复习专区'
            this.pageInfo[1].url = '/pcteacher/assign.html?tab=entrance_exam_review'
            break;
          case 'workbook':
            this.pageInfo[1].name = '听说专区'
            this.pageInfo[1].url = '/pcteacher/assign.html?tab=workbook'
            break;
          case 'classic':
            this.pageInfo[1].name = 'classic'
            break;
          default:
            break
        }
      }
      if (this.pageInfo && this.pageInfo.length>0) {
        this.navList = this.pageInfo;
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*w-breadcrumb*/
  .w-breadcrumb { padding: 0; margin: 0 0 10px; height: 18px; clear: both; width: 100%;}
  .w-breadcrumb ul, .w-breadcrumb  li{list-style: none; padding: 0; margin:0;}
  .w-breadcrumb li { float: left;}
  .w-breadcrumb li a{ color: #189cfb;}
  .w-breadcrumb li .divider { padding: 0 8px 0 2px; color: #189cfb; }
  .w-breadcrumb li.back{ float: right;}
  .w-breadcrumb .active { color: #667284; }
</style>
