<template>
  <div>
    <div class="subject">
      <ul :class="{hidden: expand}">
        <li v-for="(item, index) in menu" class="item" :class="{active: curItem=== item}" @click="select(item)">
          <div class="wrap" v-if="item.package_type === 9">
            <div style="text-align: center;margin-top: 19px;">
              <p class="tcques">
                去题库查看更多
              </p>
              <span></span>
            </div>
          </div>
          <div class="wrap" v-else-if="item.packageEnName === 'HIGH_FREQUENCY'">
            <p class="title">{{item.packageName}}</p>
            <p class="label">{{item.weekTime}}</p>
            <!-- p class="label" v-if="item.minErrorRate==item.maxErrorRate">共{{item.questionCnt}}题，失分率{{item.minErrorRate}}%</p-->
            <!-- p class="label" v-else>共{{item.questionCnt}}题，失分率{{item.minErrorRate}}%~{{item.maxErrorRate}}%</p -->
            <span></span>
          </div>
          <div class="wrap" v-else-if="item.packageEnName === 'REVIEW_VOCAB' || item.packageEnName === 'REVIEW_GRAMMAR' || item.packageEnName === 'REVIEW_READ' || item.packageEnName === 'REVIEW_LISTENING' ">
            <p class="title">{{item.packageName}}</p>
             <p class="label" v-if="page_type==2">{{item.packageType}}／推荐热度 {{item.star}} 颗星</p>
            <span></span>
          </div>
          <div class="wrap" v-else>
            <p class="title">{{item.name}}
              <!--<span class="num" v-if="item.select_num">{{item.select_num}}</span>-->
            </p>
            <p class="label" v-if="page_type==1">推荐热度 {{item.star}} 颗星</p>
            <p class="label" v-if="page_type==2">随堂练习／推荐热度 {{item.star}} 颗星</p>
            <span></span>
          </div>
        </li>
      </ul>
      <div class="more" v-if="expand">
        <span :class="{expanded: expand}" @click="expandHandle()">{{ !expand? '收起':'更多'}}<i></i></span>
      </div>
    </div>
  </div>
</template>
<script>
  // 组件通信
  import Bus from '@/marvel/bus.js'
  import Cart from '@/api/cart.js'
  // 网络请求
  import ajax from '@/api/ajax';
  //通过路径获取对象属性值
  import {hget}  from '@/utils/hobj';
  export default {
    name: 'subject',
    props: ['subjectData'],
    data: function(){
      return {
        expand: false,
        isEmpty: false,
        menu: [],
        curItem: null,
        params: {
          package_id: null,
          package_type: null,
          page_type: 0
        }
      }
    },
    created: function (){
      // 马超说不用了，后端不好计算，把这块去掉了
      // Bus.$on('updateCart', this.updateCart.bind(this))
    },
    methods:{
      updateCart:function(data){
        let menu = this.menu;
        menu.forEach((m, i)=>{
          if(m.package_type===9){
            m.select_num=this.getQuesBarNum(data)
          }else if(m.package_type===99){
            const index=this.indexOf(m.action.params.package_name.split(' ')[1], data.cart_detail)
            if(index==-1){
              m.cartSelected=0
            }else{
              m.cartSelected = parseInt(data.cart_detail[index].block_value)
            }
          }else{
            const index=this.indexOf(m.name,data.cart_detail)
            if(index==-1){
              m.select_num=0
            }else{
              m.select_num=parseInt(data.cart_detail[index].block_value)
            }
          }

        })
      },
      // 获取题库的数目
      getQuesBarNum:function(data){
        const arr=['词汇','句型','语法','听力','口语','阅读']
        let num=0;
        arr.forEach( (name)=> {
          const index=this.indexOf(name,data.cart_detail)
          if(index>-1){
            num+=parseInt(data.cart_detail[index].block_value)
          }
        })
        return num;
      },
      indexOf:function(name,arr){
        let index=-1;
        for(let i=0;i<arr.length;i++){
          if(arr[i].block_name==name){
            index=i;
            break;
          }
        }
        return index;
      },
      expandHandle: function(){
        this.expand = !this.expand
      },
      select: function (item) {
        if(this.curItem===item){
          return;
        }
        if(item.packageEnName == 'REVIEW_VOCAB' || item.packageEnName == 'REVIEW_GRAMMAR' || item.packageEnName == 'REVIEW_READ' || item.packageEnName == 'REVIEW_LISTENING'){
          this.curItem = item
          this.params.question_ids = item.action.params.question_ids
          this.params.bk_id = item.action.params.bk_id
          this.params.bkc_id = item.action.params.bkc_id
          this.params.unit_id = item.action.params.unit_id
          this.params.package_name = item.action.params.package_name
          this.params.package_type = item.action.params.package_type
          this.$emit('changeSubjectType',this.params)
          return
        }
        if(item.packageEnName == 'HIGH_FREQUENCY'){
          this.curItem = item
          this.params.group_id = item.action.params.group_id
          this.params.date = item.action.params.date
          this.params.package_type =  item.action.params.package_type
          this.params.package_name = item.action.params.package_name
          this.$emit('changeSubjectType',this.params)
          return
        }
        this.curItem = item
        this.params.package_id =  item.package_id
        this.params.package_type =  item.package_type
        this.params.package_name = item.name
        this.$emit('changeSubjectType',this.params)
      },
      init:async function (params){
        let meunTemp = [], res = []
        //初始化
        this.current = 0;
        const content = await ajax.post('/pc/v1/assign/preOverStudyPackage',params)
        this.menu = content.data.data.list || []
        this.page_type = params.page_type
        if(params.page_type == 2){
          res = await ajax.post('/pc/v1/assign/reviewAfterClassQuestionsTypes',params)
          let wrong = res.data.data.recommendPackages, packages = []
          this.menu.length && this.menu.forEach((item, index)=>{
            if(item.package_type != 9){
              meunTemp.push(item)
            }else{
              meunTemp = meunTemp.concat(wrong)
              meunTemp.push(item)
            }
          })
          this.menu = meunTemp
          if(this.menu.length == 0 && wrong.length != 0){
            this.menu = wrong
          }
        }
        if(this.menu && this.menu.length>0){
          this.isEmpty = false
          this.curItem = content.data.data.list && content.data.data.list.length && content.data.data.list[this.current]
          this.expand = this.menu.length > 6 ? true: false
          // 设置参数
          this.params= Object.assign({},params);
          this.params.package_id = this.menu[this.current].package_id
          this.params.package_name = this.menu[this.current].name
          this.params.package_type = this.menu[this.current].package_type

          if(this.menu[0].packageEnName == 'REVIEW_VOCAB' || this.menu[0].packageEnName == 'REVIEW_GRAMMAR' || this.menu[0].packageEnName == 'REVIEW_READ' || this.menu[0].packageEnName == 'REVIEW_LISTENING'){
            this.curItem = this.menu[0]
            this.params.question_ids = this.menu[0].action.params.question_ids
            this.params.bk_id = this.menu[0].action.params.bk_id
            this.params.bkc_id = this.menu[0].action.params.bkc_id
            this.params.unit_id = this.menu[0].action.params.unit_id
            this.params.package_name = this.menu[0].action.params.package_name
            this.params.package_type = this.menu[0].action.params.package_type
          }
          if(this.menu[0].packageEnName == 'HIGH_FREQUENCY'){
            this.curItem = this.menu[0]
            this.params.group_id = this.menu[0].action.params.group_id
            this.params.date = this.menu[0].action.params.date
            this.params.package_type =  this.menu[0].action.params.package_type
            this.params.package_name = this.menu[0].action.params.package_name
          }
          
          Cart.updateCart()
        }else{
          this.isEmpty = true
          return
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .subject{
    background: #fff;
    border: 1px solid #DBE6EE;
    padding: 20px 20px 10px 20px;
    ul{
      width: 747px;
      display: flex;
      flex-wrap: wrap;
      li{
          width:242px;
          margin: 0 10px 10px 0;
          box-sizing: border-box;
          &:nth-child(3n){
               margin-right: 0;
           }
        .wrap{
          border: 1px solid #dae6ee;
          position: relative;
          cursor: pointer;
          height: 58px;
          p.title{
            font-size: 14px;
            color: #555555;
            margin: 7px 0 0 11px;
            max-width: 195px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
            padding-right: 28px;
            span.num{
              position: absolute;
              right: 0px;
              top: 4px;
              width: 24px;
              height: 14px;
              font-size: 12px;
              color: #FFFFFF;
              display: inline-block;
              background: #159CFC;
              text-align: center;
              line-height: 15px;
              border-radius: 7px;
            }
          }
          p.tcques{
            position: relative;
            display: inline-block;
            padding-right: 28px;
            span.num{
              position: absolute;
              right: 0px;
              top: 4px;
              width: 24px;
              height: 14px;
              font-size: 12px;
              color: #FFFFFF;
              display: inline-block;
              background: #159CFC;
              text-align: center;
              line-height: 15px;
              border-radius: 7px;
            }
          }
          p.label{
            margin: 0 0 0 11px;
            font-size: 12px;
            color: #7F7E7E;
          }
        }
      }
      li.active{
        .wrap{
          border: 1px solid #159CFC;
          background: #F5FBFF;
          span{
            display: inline-block;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 26px;
            height: 26px;
            background: url(../../assets/img/teacher/selected.png);
            z-index: 2;
          }
        }
      }
      li:hover{
        .wrap{
          border: 1px solid #159CFC;
        }
      }
    }
    ul.hidden{
      height: 135px;
      overflow: hidden;
      width: 747px;
    }
    .more{
      height: 28px;
      text-align: center;
      padding: 10px 0;
      span{
        font-size: 14px;
        color: #159CFC;
        cursor: pointer;
        position: relative;
        i{
          display: inline-block;
          width: 12px;
          height: 9px;
          position: absolute;
          top: 2px;
          right: -17px;
          background: url(../../assets/img/teacher/nomore.png)
        }
      }
      span.expanded{
        i{
          background: url(../../assets/img/teacher/more.png)
        }
      }
    }
  }
</style>
