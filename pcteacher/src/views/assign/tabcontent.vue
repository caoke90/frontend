<template>
  <div class="material">
    <div class="material-container">
      <div class="material-list clearfix">
        <label>教材：</label>
        <div class="material-change-area" @click.stop="showSelect('book')">
          <p class="title">{{bookname}}</p><span :class="{active: curModel==='book'}"></span>
          <smaterial @selectBook="selectBook"  ref="book"></smaterial>
        </div>
      </div>
      <div class="material-list clearfix margint-12">
        <label>章节：</label>
        <div class="material-change-area marginr-46" @click.stop="showSelect('unit')">
          <p class="title">{{unitname}}</p><span :class="{active: curModel==='unit'}"></span>
          <schapter @selectItem="selectUnit" ref="unit"></schapter>
        </div>
        <div class="material-change-area" @click.stop="showSelect('lesson')">
          <p class="title">
            {{lessonname}}
            <span :class="{active: curModel==='lesson'}"></span>
          </p>
          <schapter @selectItem="selectLesson"  ref="lesson"></schapter>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '@/marvel/bus.js'
  import smaterial from './selectmaterial.vue'
  import schapter from './selectChapter.vue'
  // 网络请求
  import ajax from '@/api/ajax'
  import qs from 'qs'
  import sa from '../../utils/sensorsdata'

  export default {
    components: {
      smaterial,
      schapter,
    },
    data () {
      return {
        BookTree: '',
        UnitList: [],
        LessonList: [],
        curSelect:null,
        bookname:'',
        unitname:'',
        lessonname:'',
        isUser: false,
        currentBook: {
          version: '',
          material: '',
        },
        isSelect: false,
        curUnit: null,
        curLesson: null,
        curModel:null,
        params: {
          bk_id: '',
          bkc_id: '',
          unit_id: ''
        }
      }
    },
    methods: {
      // 显示选择
      showSelect: function (model){
        if(this.curModel==model){
          this.curSelect.hide()
          this.curSelect=null
          this.curModel=null
          return
        }
        if(this.curSelect){
          this.curSelect.hide()
        }
        if(model=='book'){
          this.curSelect=this.$refs.book
        }else if(model=='unit'){
          this.curSelect=this.$refs.unit
        }else if(model=='lesson'){
          this.curSelect=this.$refs.lesson
        }
        this.sendLog(model)
        this.curModel= model
        this.curSelect.show()
      },
      //神策打点
      sendLog: function(model) {
        let params = qs.parse(location.search.substr(1))
        let paramsArr = {
          sync : '教材同步',
          junior_review : '听说专区',
          entrance_exam_review : '复习专区',
          workbook : '教辅选题',
          classic : '经典读物'
        }
        sa.track('onlineEn_Assignment_SyncClick', {
          moduleName: paramsArr[params.tab],
          buttonName: model == 'book' ? '教材' : '章节'
        });
      },
      loadUITree: async function(params) {
        Object.assign(this.params,params)
        this.UnitList=[];
        this.curUnit=null;
        this.LessonList=[];
        this.curLesson=null;
        const content = await ajax.post('/pc/v1/assign/loadUlTree',params)
        let unitList = content.data.data.unit_list
        let selectUnitId = content.data.data.selectUnitId
        let selectLessonId = content.data.data.selectLessonId
        let selectBookName = content.data.data.name
        let selectBookId  = content.data.data._id
        let selectParentId  = content.data.data.parent_id
        let selectClazzLevel = content.data.data.clazz_level
        if(selectUnitId) {
          unitList.forEach((item, index) => {
            if (item._id === selectUnitId) {
              item.select = false
              this.curUnit = item
            } else {
              item.select = false
            }
          })
        }
        this.UnitList = unitList
        this.curUnit=this.curUnit||this.UnitList[0]
        this.curUnit.select = true
        if(selectLessonId){
          this.curUnit.lesson_list.forEach((im, i)=>{
            if(im._id === selectLessonId){
              im.select = true
              this.curLesson = im
            }else{
              im.select = false
            }
          })
        }
        this.$refs.unit.init(unitList)

        this.LessonList = this.curUnit.lesson_list
        this.curLesson=this.curLesson||this.LessonList[0]
        this.$refs.lesson.init(this.curUnit.lesson_list)
        this.curLesson.select = true

        // 设置当前参数
        if(selectBookId && !this.isUser){
          this.params.bk_id = selectBookId
        }
        this.params.bkc_id = this.curLesson._id
        this.params.unit_id = this.curUnit._id
        !this.isUser && (this.params.class_level = selectClazzLevel)

        !this.isUser && await this.$refs.book.init({
          bk_id: selectBookId,
          parent_id: selectParentId,
          class_level: selectClazzLevel,
          name: selectBookName
        })

        // 设置章节名称
        this.unitname=this.curUnit.name||this.curUnit.alias
        this.lessonname=this.curLesson.name||this.curLesson.alias
      },
      selectBook:async function (item){
        this.isUser = true
        this.curSelect=null
        this.curModel=null
        this.bookname=this.$refs.book.currentMaterial.name
        this.params.bk_id =  this.$refs.book.currentMaterial._id
        this.params.class_level =  item.clazz_level
        await this.loadUITree(this.$refs.book.params)
        // 刷新
        await Bus.tabsync.refresh()
      },
      selectUnit:async function (item){
        this.curUnit=item;
        this.curUnit.select = true
        this.LessonList = this.curUnit.lesson_list

        this.curLesson=this.LessonList[0]
        this.curLesson.select = true
        // 设置当前参数
        this.params.unit_id =this.curUnit._id
        this.params.bkc_id =this.curLesson._id
        // 设置章节名称
        this.unitname=this.curUnit.name||this.curUnit.alias
        this.lessonname=this.curLesson.name||this.curLesson.alias
        this.$refs.lesson.num = 0
        this.$refs.lesson.init(this.curUnit.lesson_list)
        // 刷新
        await Bus.tabsync.refresh()
        this.curSelect=null
        this.curModel=null
      },
      selectLesson:async function (item){
        this.curLesson=item;
        this.curLesson.select = true
        this.params.bkc_id =this.curLesson._id
        this.lessonname=this.curLesson.name||this.curLesson.alias
        // 刷新
        await Bus.tabsync.refresh()
        this.curSelect=null
        this.curModel=null
      },
      init:async function(){
        await this.loadUITree(this.$refs.book.params)
        this.bookname=this.$refs.book.currentMaterial.name
      }
    },
    created:async function() {
      let vm = this
      document.addEventListener('click', () => {
        if(this.curSelect){
          this.curSelect.hide()
          this.curSelect = null
          this.curModel = null
          this.isUser = false
          vm.init()
        }
      }, false)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .marginr-46{
    margin-right: 46px;
  }
  .margint-12{
    margin-top: 12px;
  }
  .clearfix::after{
    display: block;
    content:'';
    clear: both;
    height:0;
  }
  .material{
    position: relative;
    margin-bottom: 10px;
    &-container{
      padding: 20px;
      margin-bottom:0;
      border:1px solid #d6dee3;
      border-top: 0;
      position:relative;
      top: 0px;
      clear: both;
      background-color: #fff;
    }
    &-list{
      clear: both;
      line-height: 16px;
      label{
        float: left;
        font-size: 12px;
        color: #555555;
        font-family: MicrosoftYaHei;
      }
      p{
        line-height: 16px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #555555;
        max-width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p:hover{
        color: #159CFC;
      }
      span{
        width: 10px;
        height: 10px;
        background: url(../../assets/img/tri_normal.png);
        position: absolute;
        top: 50%;
        right: -16px;
        margin-top: -6px;
      }
      span.active{
        background: url(../../assets/img/up_selected.png);
        background-repeat: no-repeat;
        background-position: 0px 2px;
      }

    }
    &-change-area{
      float: left;
      position: relative;
      cursor: pointer;
    }
  }

</style>
