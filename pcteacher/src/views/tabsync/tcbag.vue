<template>
  <div>
    <bagBar v-show="isShowBagBar && card_group.length" ref="bagBar"></bagBar>
    <div class="tcbag">
      <template v-if="card_group.length">
        <div class="box" style="margin:4px 0 14px 0">
          <div class="card clearfix">共<span>{{questionsCount}}</span>大题，预计<span>{{finishedTime}}</span>分钟
            <div class="btn" v-if="!isselect" @click="toggle">全部选入</div>
            <div class="btn remove" v-else @click="toggle">全部移除</div>
          </div>
        </div>
        <div class="box" v-for="(item, index) in card_group">
          <question  :question='item' :qindex="index" ></question>
        </div>
      </template>
      <template v-else>
        <msg style="height: 400px;" :card="{type:'empty'}"></msg>
      </template>
    </div>
  </div>
</template>

<script>
  // 组件通信
  import Bus from '@/marvel/bus.js'
  //购物车
  import Cart from '@/api/cart';
  // 网络请求
  import ajax from '@/api/ajax';
  //通过路径获取对象属性值
  import {hget}  from '@/utils/hobj';
  import Question from '@/models/question/Question'
  import msg from '@/components/cards/msg.vue'
  import sa from '@/utils/sensorsdata'

  export default {
    name: 'tcbag',
    data: function(){
      return{
        success: 'ok',
        card_groupCache: [],
        card_group: [],
        isFilter: false,
        isShowBagBar: true
      }
    },
    computed:{
      questionsCount: function(){
        return this.card_group.length;
      },
      finishedTime: function(){
        let time = 0;
        if (this.card_group.length >0) {
          this.card_group.forEach(function(card){
            time += card.seconds  || 0;
          });
        }
        return Math.ceil(time/60);
      },
      isselect: function () {
        if (this.card_group.length >0) {
          return  this.card_group.every(function(card) {
            return card.selected;
          })
        }
      }
    },
    components:{
      bagBar:require('./bagBar.vue'),
      msg,
    },
    methods:{
      toggle: function () {
        let questionIDList = []
        if(!this.card_group.length){return;}
        let isall = this.isselect;
        for (let i = 0; i < this.card_group.length; i++) {
          if (!isall) {
            this.card_group[i].selected = true
          } else {
            this.card_group[i].selected = false
          }
        }
        this.card_group.forEach((item)=>{
          questionIDList.push(item.id)
        })
        if(isall){
          Bus.$emit('Cart',{
            type:'remove_questions_all',
            ques:this.card_group
          })
        }else{
          Bus.$emit('Cart',{
            type:'add_questions_all',
            ques:this.card_group
          })
        }
      },
      refreshCart: async function () {
        this.card_groupCache.forEach((item)=>{
          item.selected =  Cart.hasQuestion(item);
        })
      },
      setCard_group:function(info){
        // 遍历question_boxs数组为item添加category属性
        info.question_boxs && info.question_boxs.map(((item, index)=>{
          item.category = info.category
          return item
        }))
        const card_groupCache=[]
        // 生成题目数据
        info.question_boxs && info.question_boxs.forEach((item, index)=>{
          const itemTemp = new Question(item)
          itemTemp.selected =  Cart.hasQuestion(itemTemp)
          card_groupCache.push(itemTemp)
        });
        this.card_group = card_groupCache
        this.card_groupCache = card_groupCache

      },
      nextInit:function(){
        let vm = this,
            card_group_cache = [],
            pointList = this.$refs.bagBar.params.kps,
            typeList = this.$refs.bagBar.params.content_sub_type_ids,
            isFilter = this.$refs.bagBar.isFilter

        if(pointList.length !== 0){
          vm.card_groupCache.forEach((item)=>{
            pointList.forEach((i)=>{
              if(item.wordId == i && card_group_cache.indexOf(item)==-1){
                card_group_cache.push(item)
              }
            })
          });
        }

        if(typeList.length !== 0 && pointList.length!== 0){
          let card_group_cache_temp = [];
          card_group_cache.forEach((item)=>{
            typeList.forEach((i)=>{
              if(item.questionType2Id == i){
                card_group_cache_temp.push(item);
              }
            });
          });
          card_group_cache = card_group_cache_temp;
        }else{
          vm.card_groupCache.forEach((item)=>{
            typeList.forEach((i)=>{
              if(item.questionType2Id == i && card_group_cache.indexOf(item)==-1){
                card_group_cache.push(item);
              }
            });
          });
        }

        if(pointList.length === 0 && typeList.length === 0){
          card_group_cache = vm.card_groupCache;
        }
        // 过滤已使用的题目
        isFilter && (card_group_cache = card_group_cache.filter((item)=>{
          if(!item.isUsed){
            return item;
          }
        }));
        vm.card_group = card_group_cache;
        card_group_cache =[];
      },
      init: async function (params){
        window.currentScene = '题包'
        var bagMap = {
          '单词跟读': 1,
          '词汇识记': 1,
          '词汇运用': 1,
          '词汇识记': 1
        },
        package_type = params.package_type
        if(bagMap[params.package_name] && !(package_type =='HIGH_FREQUENCY' ||  package_type == 'REVIEW_VOCAB' || package_type == 'REVIEW_GRAMMAR' || package_type == 'REVIEW_READ' || package_type == 'REVIEW_LISTENING')){
          this.isShowBagBar = true
        }else {
          this.isShowBagBar = false
        }
        await this.$refs.bagBar.init(params)
        this.$refs.bagBar.info != {} && this.setCard_group(this.$refs.bagBar.info)
        
        if(!(package_type =='HIGH_FREQUENCY' || package_type =='HIGH_FREQUENCY' ||  package_type == 'REVIEW_VOCAB' || package_type == 'REVIEW_GRAMMAR' || package_type == 'REVIEW_READ' || package_type == 'REVIEW_LISTENING')){
          await this.nextInit()
        }
        this.sendLog()
      },
      //神策打点
      sendLog:function(){
        sa.track('onlineEn_Assignment_QuestionPackageContentView', {
          questionPackageName: this.$parent.$refs.sub1.curItem.name,
          questionPackageID: this.$parent.$refs.sub1.curItem.package_id,
          materialName: Bus.tabsync.$refs.tabcontent.bookname,
          materialUnit: Bus.tabsync.$refs.tabcontent.unitname,
          mainKnowLesson: Bus.tabsync.$refs.tabcontent.lessonname
        })
      }
    },
    mounted: function () {
     
      this.$refs.bagBar.$on('nextInit', () =>{
        this.nextInit()
      })
      Bus.$on('updateCart', ()=> {
        this.refreshCart()
        // Bus.tabsync.changePracticeType(Bus.tabsync.curIndex)
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .tcbag{
    padding: 10px 20px;
    background: #fff;
    .box{
      margin-top: 10px;
      .card{
        text-align: right;
        line-height: 30px;
        span{
          font-size: 14px;
          color: #159CFC;
          padding: 0 4px;
        }
        .btn{
          width: 80px;
          line-height: 30px;
          border: 1px solid #159CFC;
          color: #159CFC;
          border-radius: 2px;
          text-align: center;
          float: right;
          margin-left: 10px;
          cursor: pointer;
        }
        .btn.remove{
          background: #A3D9FE;
          color: #fff;
          border: none;
        }
      }
    }
  }

  .clearfix::after{
    display: block;
    content:'';
    clear: both;
    height:0;
  }
</style>
