<template>
  <modal  :isshow="isshow">
    <div  class="jqiform" v-if="isshow">
      <div class="jqiclose" @click="hide">×</div>
      <div class="jqistates">
        <div class="jqistate" data-jqi-name="state0" style="">
          <div class="jqiarrow" style=""></div>
          <div class="lead jqititle ">发布练习</div>
          <div class="jqimessage ">
            <div id="saveMathDialog" style="margin-top:20px" avalonctrl="assign_homework_box">
              <div class="h-homework-dialog03 h-homework-dialog" style="">
                <div class="inner" v-if="!isHomeworkDone && !isLoading">
                  <div>班级
                    <div class="clazz-box" style="">
                      <div class="mod-course" onselectstart="return!1" style="vertical-align:top;margin-left:-35px">
                        <div class="newinner" style="padding:0;min-height:22px;min-width:205px">
                          <div class="innerContainer" :key="key1">
                            <p class="v-targets w-in-block w-magL-10" v-for="(item,k) in clazzList" :class="{'w-checkbox-current':item.isselect}" :key="k" @click="toggle(item)" style="display: block;">
                              <span class="w-checkbox" style="float:none"></span>
                              <span class="w-icon-md" style="float:none">{{item.grade_id+'年级 '+item.clazz_name}}
                                <i style="font-style:normal">( 预计{{Cart.cartRows.duration_minutes}}分钟 )</i></span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>练习名称
                    <span class="tj">
                      <input class="inputstyle" id="home-work-name" v-model="prepare.homework_name" @focus="focusWord" @blur="blurWord" maxlength="30">
                      </span>
                    <span class="warnword">{{warnWord}}</span>
                  </p>
                  <div>练习截止时间
                    <label style="cursor:pointer" :class="{'w-radio-current':selected==0}" @click="select(0)" >
                      <span class="w-radio"></span>
                      <span class="w-icon-md">今天内</span></label>
                    <label style="cursor:pointer" :class="{'w-radio-current':selected==1}" @click="select(1)" >
                      <span class="w-radio"></span>
                      <span class="w-icon-md">明天内</span></label>
                    <label style="cursor:pointer" :class="{'w-radio-current':selected==2}" @click="select(2)" >
                      <span class="w-radio"></span>
                      <span class="w-icon-md">三天内</span></label>
                    <div style="padding-left:144px;margin-bottom:5px" :class="{'w-radio-current':selected==-1}" @click="select(-1)" >
                      <span style="cursor:pointer">
                        <span class="w-radio"></span>
                        <span class="w-icon-md">自定义</span></span>
                      <p class="w-in-block" v-show="selected==-1">
                        <el-date-picker
                          class="jpdatepicker2"
                          :editable="false"
                          :clearable="false"
                          v-model="endDate"
                          type="date"
                          placeholder="自定义时间">
                        </el-date-picker>
                        <select v-model="endHour" style="width:63px" class="w-int">
                          <option :value="item" v-for="item,k in hourArr" :selected="endHour==item" :key="k">{{item}}</option>
                        </select>
                        <select v-model="endMinute" style="width:63px" class="w-int">
                          <option :value="item" v-for="item,k in minuteArr" :selected="endMinute==item" :key="k">{{item}}</option>
                        </select>
                      </p>
                    </div>
                  </div>
                  <p class="tips-grey">提交练习截止时间为
                    <span style="padding-left:0">{{endDate|format}}&nbsp;&nbsp;&nbsp;{{endHour}}:{{endMinute}}(星期{{getWeek()}})</span></p>
                  <p class="tips-warn">时间截止后提交练习算补做</p>
                  <div class="assign-homework-form-item clearfix" v-if="intelligence">
                    <div class="assign-homework-form-item-title">
                      <span>更多</span>
                    </div>
                    <div class="assign-homework-form-item-content">
                      <p>
                    <span @click="intelligence_homework=!intelligence_homework">
                        <span class="w-checkbox" :class="{'w-checkbox-current':intelligence_homework}"
                              style="float: none"></span>
                        <span class="w-icon-md" style="float: none">自适应练习</span>
                    </span>
                      </p>
                      <p class="assign-homework-form-item-tips" style="color:#ff0000">
                        {{intelligence_homework?'本次推荐了词汇练习，为了提高练习效率，已推荐为自适应练习':'本次推荐了词汇练习，为了提高学生做练习效率，建议您推荐为自适应练习'}}
                      </p>
                      <p class="assign-homework-form-item-tips">自适应练习，是指经系统自动化判定认为学生已经掌握的单词，将在本次练习中直接跳过针对该单词的其他练习。这样，可以缩短学生做练习的时间，提高练习效率。</p>
                    </div>
                  </div>
                  <p class="labelendhours">
                    <span class="w-checkbox" style="margin-right:10px" :class="{'w-checkbox-current':haveOpenTime}" @click="haveOpenTime=!haveOpenTime"></span>公布答案时间
                    <span style="cursor: pointer; padding-right: 0px; margin-left: 30px;" v-show="haveOpenTime">
                      <el-date-picker
                        class="jpdatepicker"
                        v-model="openAnswerDate"
                        :editable="false"
                        :clearable="false"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                      <!--<input type="text" id="openInput" style="z-index:1001;position:relative;padding:6px 6px" readonly="readonly" class="c-ipt hasDatepicker">-->
                      <select  style="width:63px;height:30px" class="w-int">
                        <option value="23" selected="selected">23</option>
                      </select>
                      <select style="width:63px;height:30px" class="w-int">
                        <option value="59" selected="selected">59</option>
                      </select>
                    </span>
                  </p>
                  <div class="btn-box">
                    <a href="javascript:void(0);" class="w-btn w-btn-green w-btn-small" style="margin-right:35px;width:120px" @click="hide">取消</a>
                    <a href="javascript:void(0);" class="v-to-exam w-btn w-btn-small" style="width:120px" @click="submit">确认发布</a></div>
                </div>

                <div class="inner" v-if="isHomeworkDone && !isLoading">
                  <div class="w-base h-homework-success">
                    <div class="title">
                      <img src="../../assets/img/teacher/homework-succ43.png">
                      <span class="text">{{message}}</span></div>
                    <div class="content">
                      <div class="text">
                        <p class="w-in-block">{{result.name}}</p>
                        <p class="w-in-block" style="margin-left:30px;">{{result.clazzName}}</p>
                        <div class="downloadUrl" v-if="result.downloadUrl">
                          <a class="w-blue" target="_blank" :href="zxbaseURL+result.downloadUrl">下载本次练习</a>
                        </div>
                      </div>

                    </div>
                    <div class="btns">
                      <a class="w-btn" href="javascript:void(0)" @click='makePoint("view")'>查看练习</a>
                      <a class="continue" href="javascript:void(0)" @click='makePoint("create")'>继续发布</a>
                    </div>
                  </div>
                </div>
                <div v-if="isLoading" style="height: 400px; background-color: white; width: 98%;position: relative"><img
                  src="../../assets/img/loading.gif"
                  style="width: 144px;height: 147px;position: absolute;top: 50%;left: 0;right: 0;margin: -74px auto 0;"/></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>

  import Bus from '@/marvel/bus.js'
  import ajax from '@/api/ajax.js'
  import Cart from '@/api/cart.js'
  import sa from '@/utils/sensorsdata'
  import qs from 'qs'

  // 日期时间
  require('../../utils/Format.js')

  export default {
    name: 'buzhi',
    components: {
      'modal':require('./modal.vue'),
    },
    data () {
      const hourArr=[]
      for(let i=0;i<24;i++){
        if(i<10){
          hourArr.push('0'+i)
        }else{
          hourArr.push(''+i)
        }
      }
      const minuteArr=[]
      for(let i=0;i<60;i++){
        if(i<10){
          minuteArr.push('0'+i)
        }else{
          minuteArr.push(''+i)
        }
      }
      return {
        zxbaseURL:window.zxbaseURL,
        zybaseURL:window.zybaseURL,

        hourArr:hourArr,
        minuteArr:minuteArr,

        isshow:false,
        isHomeworkDone:false,
        isLoading:false,
        key1:1,
        Cart:Cart,
        // 自适应练习
        intelligence:false,
        intelligence_homework:false,
        oriclazzList:null,
        clazzList:[],
        clazz_ids:[],
        warnWord:'',

        // 练习截止选择
        selected:0,
        endDate:'',
        endHour:'',
        endMinute:'',

        // 是否公布答案
        haveOpenTime:false,
        openAnswerDate:'',
        //加载完的数据
        prepare:{
          homework_name:'',
          start_time:0,
          close_time:0,
          current_time:0,
          open_answer_time:'',
          expect_duration:'',
          intelligence_isopen:0,
          various_expect_duration:'',
          independent_clazz_ids:'',
        },
        // 保存后的数据
        result:{

        },
        message: ''
      }
    },
    watch:{
      endDate:function (nval,oval) {
        const today=new Date(this.prepare.current_time).Format('yyyy-MM-dd')
        if(new Date(nval).getTime()<new Date(today).getTime()){
          this.endDate=oval
        }
      }
    },
    filters: {
      format: function (value) {
        return new Date(value).Format('yyyy-MM-dd')
      }
    },
    methods:{
      // 查看练习 、继续推荐
      makePoint: function (btn_type) {
        if (btn_type == "view") {
          window.location.href = this.zxbaseURL+"/teacher/homework/list?from=create_assignment_modal_btn_create_assignment";
        }
        else if (btn_type == "create") {
          //根据url不同来进行不容的跳转
          window.location.href = (process.env.STAGE=='production'?'/s17':'')+"/pcteacher/assign.html?from=create_assignment_modal_btn_create_assignment";
        }
      },
      getWeek:function(){
        var arr = ["日", "一", "二", "三", "四", "五", "六"];
        var week = new Date(this.endDate).getDay();
        return arr[week]
      },
      toggle:function(item){
        item.isselect=!item.isselect;
        const clazz_ids=[]
        this.clazzList.forEach(function (item) {
          if(item.isselect){
            clazz_ids.push(item.group_id)
          }
        })
        if(clazz_ids.length>0){
          this.clazz_ids=clazz_ids;
          this.key1++
        }else{
          item.isselect=!item.isselect;
        }

      },
      // 练习截止时间选择
      select:function(val){
        if(val==this.selected){return;}
        this.selected=val
        let day=val==-1?2:val
        this.endDate=new Date(this.prepare.current_time+day*24*3600000).Format('yyyy-MM-dd')
        this.openAnswerDate=this.endDate
        this.endHour='23'
        this.endMinute='59'
      },
      init:function(){
        this.clazzList=JSON.parse(JSON.stringify(this.oriclazzList));
        this.clazzList.forEach((item, index)=>{
          const arr=item.clazz_name.match(/\d/g)||[];
          item.orderId = parseInt(item.grade_id+ arr[0])
        })
        this.clazzList.sort(function (p1,p2) {
          return p1.orderId-p2.orderId;
        })

        this.clazzList.forEach(function (item) {
          item.isselect=true;
        })
        const clazz_ids=[]
        this.clazzList.forEach(function (item) {
          if(item.isselect){
            clazz_ids.push(item.group_id)
          }
        })
        this.clazz_ids=clazz_ids;
        this.select(2)
        this.intelligence = this.prepare.intelligence || false;
        this.intelligence_homework = this.prepare.intelligence_isopen == 1 ? true : false;
        this.isLoading=false;
      },
      show:function () {
        this.isshow=true;
        this.isLoading=true;
      },
      hide:function () {
        this.isshow=false;
        this.isLoading=false;
        if(this.isHomeworkDone){
          window.location.reload()
        }
      },
      // 练习名称
      blurWord: function () {
        if (this.prepare.homework_name.length > 30) {
          this.warnWord = "练习名称最大30字符"
        }
      },
      focusWord: function () {
        this.warnWord = ""
      },
      submit:function () {
        if (this.prepare.homework_name == '') {
          this.warnWord = "请填写练习名称";
          return;
        }
        if (this.prepare.homework_name.length > 30) {
          this.warnWord = "练习名称最大30字符"
          return;
        }
        var et = new Date(this.endDate).Format('yyyy-MM-dd') + " " + this.endHour + ':' + this.endMinute;
        et = et.replace(/\-/g, "/")
        var endTime = parseInt((new Date(et)).getTime() / 1000);
        // clazz_ids 改为group_ids
        var config = {
          name: this.prepare.homework_name,
          end_time: endTime,
          clazz_ids: this.clazz_ids,
          intelligence_isopen: this.intelligence_homework ? 1 : 0
        };
        if (this.haveOpenTime) {
          let openAnswerDateTemp = new Date(this.openAnswerDate).Format('yyyy-MM-dd') + " " + 23 + ':' + 59;
          openAnswerDateTemp = openAnswerDateTemp.replace(/\-/g, "/")
          config.open_answer_time = parseInt((new Date(openAnswerDateTemp)).getTime() / 1000);
        }

        // 神策打点参数
        let proSource = qs.parse(location.search.substr(1))['tab'] || 'sync'
        let questionNum = Cart.cartRows.question_count
        let homeworkName =  this.prepare.homework_name
        let classIDList = this.clazz_ids || []
        let classNameList = []
        this.clazzList.forEach((item)=>{
          classIDList.forEach((id, i)=>{
            if(item.group_id == id){
              classNameList.push(item.grade_id+'年级 '+item.clazz_name)
            }
            classIDList[i] = id+''
          })
        })
        let expectTime = this.prepare.expect_duration
        this.sensorSendLog(proSource, questionNum, homeworkName, classIDList, classNameList, endTime, expectTime)
        this.save(config)
      },
      sensorSendLog(proSource, questionNum, homeworkName, classIDList, classNameList, endTime, expectTime){
        let sourceMap = {
          sync: '同步',
          junior_review: '听说',
          entrance_exam_review: '复习',
          workbook: '教辅',
          classic: '跟读'
        }
        sa.track('onlineEn_Assignment_ReleaseHomework',{
          proSource: sourceMap[proSource],
          questionNum,
          homeworkName,
          classIDList,
          classNameList,
          endTime,
          expectTime,
        })
      },
      save:async function (config) {
        this.isLoading=true;
        const resp=await ajax.post(this.zxbaseURL+'/teacher/assign/save', config)
        if(resp.data.error_code === 0){
          this.message = '发布练习成功！'
        }else{
          this.message = resp.data.message || '未知错误！'
        }
        this.result.name = resp.data.data.name;
        this.result.clazzName = resp.data.data.clazz_name;
        this.result.downloadUrl = resp.data.data.download_url;
        this.isHomeworkDone=true;
        this.isLoading=false;
      },
      /*
    推荐练习
    */
      buzhi:async function () {
        // 显示loading
        this.show();
        const [resp]=await ajax.all([
          ajax.get(this.zxbaseURL+'/teacher/assign/prepare'),
          this.loadClazzList(),
        ]);
        Object.assign(this.prepare,resp.data.data)
        // 显示页面
        this.init()
      },
      //推荐练习- 年级列表
      loadClazzList:async function () {
        if(!this.oriclazzList){
          const resp=await ajax.post('/pc/v1/assign/loadClass');
          this.oriclazzList=resp.data.data
        }
        return this.oriclazzList;
      },
    },
    created:function () {
      Bus.buzhi=this;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .h-homework-dialog .el-input--small .el-input__prefix{display: none;}
  .h-homework-dialog .el-input--small .el-input__suffix{display: none;}
  .h-homework-dialog .el-input--small .el-input__inner{padding-left: 6px;}
  .h-homework-dialog .jpdatepicker.el-input--small{width: 94px;height: 30px;padding: 6px 6px}
  .h-homework-dialog .jpdatepicker.el-input--small input.el-input__inner{border-radius: 0;padding-right: 0;height: 30px;line-height: 30px;}

  .h-homework-dialog .jpdatepicker2.el-input--small{width: 94px;height: 30px;padding: 3px 5px;}
  .h-homework-dialog .jpdatepicker2.el-input--small input.el-input__inner{border-radius: 0;padding-right: 0;height: 30px;line-height: 30px;}
</style>
<style scoped>
  .h-homework-dialog p,.h-homework-dialog input,.h-homework-dialog label{ box-sizing: content-box;}
  .h-homework-dialog select.w-int{ height: 30px;box-sizing: border-box;}
  .jqiform{min-height: 70vh;}
  /*popup - box*/
  .jqiform .jqiclose { font-size: 28px; font-weight: normal; color: #000; border-left: 1px solid #dae6ee; padding: 0; height: 46px; line-height: 40px; width: 46px; text-align: center; position: absolute; top: 0; right: 0; _line-height: 48px; overflow: hidden;cursor: default}
  .jqiform .jqistates{background-color: #fff; float: none;}
  .jqiform .jqititle {  border-bottom: 1px solid #dae6ee;color: #383a4b; padding: 13px 0 13px 20px;    line-height: 20px; font-size:18px; margin-bottom:30px;}

  .w-int {
    background-color: #fff;
    border: 1px solid #dedede;
    color: #555;
    width: 150px;
    padding: 2px 9px;
    line-height: 19px;
    height: 19px;
    vertical-align: middle;
  }
  .h-homework-dialog {
    width: 460px;
    font-size: 14px;
    color: #4e5656;
    background: #fff;line-height: 20px; }
  .h-homework-dialog p.v-targets{
    cursor:pointer;
  }
  .h-homework-dialog .inner {
    padding: 0 20px; }

  .h-homework-dialog .inner p {
    margin-bottom: 15px;
    line-height: 1.5; }

  .tips-warn, .tips-grey {
    color: #8e9696; }

  .h-homework-dialog .inner p label {
    padding-right: 25px; }

  .h-homework-dialog .inner p input,
  .h-homework-dialog .inner p select {
    cursor: pointer; }

  .h-homework-dialog p.tips-grey {
    text-align: center;
    color: #8e9696;
    margin-bottom: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #8e9696;
    margin-left: 40px; }

  .h-homework-dialog p.labelendhours {
    height: 30px;
    line-height: 2.5; }

  .warnword {
    color: #d21900;
    font-size: 12px;
    margin-left: 15px;
    color: #ee0000; }

  .inputstyle {
    width: 150px;
    height: 22px;
    border: 1px solid #dedede;
    color: #999;
    padding-left: 10px; }

  .tips-warn {
    color: #8e9696;
    margin-bottom: 10px;
    padding-left: 144px;
    font-size: 12px; }

  .h-homework-dialog .inner .btn-box,
  .h-homework-dialog02 .btn-box {
    padding: 20px 0;
    text-align: center;
    color: #4e5656; }

  .h-homework-dialog .inner .clazz-box .content {
    color: #4e5656;
    font-size: 14px; }

  .h-homework-dialog02 textarea {
    width: 98%;
    height: 90px;
    border: 1px solid #dedede;
    outline-style: none;
    font-size: 14px;
    line-height: 20px; }

  .h-homework-dialog03 {
    width: 550px; }

  .h-homework-dialog04 {
    width: 500px; }

  .h-homework-dialog03 .clazz-box {
    margin-left: 114px;
    margin-bottom: 15px; }

  .h-homework-dialog03 .clazz-box .w-select .current {
    padding: 4px 13px; }

  .h-homework-dialog03 p span.tj {
    margin-left: 86px;
    display: inline-block; }

  .h-homework-dialog03 div label {
    display: inline-block;
    margin-bottom: 5px;
    padding-right: 30px; }

  .h-homework-dialog03 div label:first-child {
    margin-left: 56px; }

  .h-homework-dialog03 > .inner > p:nth-of-type(2) > span {
    padding-left: 60px;
    margin-left: 0; }

  .h-homework-dialog03 .tjtimer span {
    padding-left: 60px;
    margin-left: 0; }

  .h-homework-dialog03 p span.tj .inputstyle {
    padding: 4px 13px;
    font-size: 14px;
    color: #4e5656;
    cursor: text; }

  .h-homework-dialog03 p .c-ipt {
    width: 80px;
    padding: 3px 5px;
    background: #fff;
    border: 1px solid #dedede;
    vertical-align: middle; }
  .h-homework-dialog03 p.w-in-block {
    display: inline-block;
    margin-left: 10px;
    margin-bottom: 0;
    line-height: 23px; }

  .h-homework-dialog03 .inner .tjpadding {
    padding-left: 86px;
    margin-left: 0; }

  /*推荐成功*/
  .h-homework-success {
    position: relative;
  padding-bottom: 15px;
  }

  .h-homework-success .title {
    text-align: center; }

  .h-homework-success .title .text {
    margin-left: 20px;
    font-size: 20px;
    color: #3d9c00; }

  .h-homework-success .content {
    margin: 22px 0 35px 0;
    text-align: center; }

  .h-homework-success .content .icon {
    display: inline-block;
    width: 75px;
    height: 52px;
    background: url("../../assets/img/teacher/homework-success.png") no-repeat; }

  .h-homework-success .content .text {
    display: inline-block;
    vertical-align: top;
    padding-left: 20px;
    line-height: 28px;
    color: #667284; }

  .h-homework-success .btns {
    text-align: center;
  }

  .h-homework-success .btns a {
    height: 40px;
    line-height: 40px;
    padding: 0;
    width: 100px;
    font-size: 14px; }

  .h-homework-success .btns .w-btn {

    background-color: #1abc9c;
    border: 1px solid #08977b; }

  .h-homework-success .btns .w-btn:hover {
    background-color: #1abc9c; }

  .h-homework-success .btns .w-btn:active {
    background-color: #00ab89; }

  .h-homework-success .btns .continue {
    display: inline-block;
    color: #fff;
    background-color: #189cfb;
    border: 1px solid #0979ca;
    border-radius: 2px;
    margin-left: 15px; }

  .h-homework-success .btns .continue:hover {
    background-color: #52b4fb; }

  .h-homework-success .btns .continue:active {
    background-color: #0092fa; }

  .h-homework-dialogs {
    width: 550px; }

  .h-homework-dialogs p .c-ipt {
    width: 80px;
    padding: 3px 5px;
    background: #fff;
    border: 1px solid #dedede;
    vertical-align: middle; }

  .assign-homework-form-item {
    margin-bottom: 15px; }
  .assign-homework-form-item .assign-homework-form-item-title {
    width: 140px;
    float: left; }
  .assign-homework-form-item .assign-homework-form-item-content {
    margin-left: 140px; }
  .assign-homework-form-item .assign-homework-form-item-content p {
    margin-bottom: 5px; }
  .assign-homework-form-item .assign-homework-form-item-tips {
    font-size: 12px;
    color: #8e9696; }
  .assign-homework-form-item p.assign-homework-form-item-tips {
    margin-bottom: 0; }

  /* 年级滚动*/
  .clazz-box {
    display: inline-block;
    margin-bottom: 10px; }

  .clazz-box .w-select .current .w-icon-arrow {
    margin: 7px 0 0;
    height: 7px;
    background-position: -20px -7px; }

  .clazz-box .w-select .current .w-icon-arrow.up {
    background-position: -20px 0px; }

  .clazz-box .mod-course {
    position: relative;
    font-size: 12px;
    display: inline-block;
    vertical-align: middle; }

  .clazz-box .mod-course span {
    float: left; }

  .clazz-box .mod-course .newinner {
    margin-left: 20px;
    overflow: hidden; }

  .clazz-box .mod-course .newinner .list {
    float: left;
    overflow: hidden;
    margin: 10px 0 0 10px; }

  .clazz-box .mod-course .newinner .list .homework-title {
    margin: 0 15px;
    max-width: 120px; }

  .clazz-box .mod-course .btn {
    position: absolute;
    top: 0;
    display: block;
    width: 20px;
    cursor: pointer;
    text-align: center;
    height: 22px;
    line-height: 22px;
    font-weight: bold; }

  .clazz-box .mod-course .btn em {
    display: block;
    width: 10px;
    height: 10px;
    margin-top: 7px;
    margin-left: 6px;
    background: url(../../assets/img/teacher/markBox-4.png) no-repeat 5000px 5000px; }

  .clazz-box .mod-course .prev {
    left: 0; }

  .clazz-box .mod-course .prev.hidden,
  .clazz-box .mod-course .next.hidden {
    visibility: hidden; }

  .clazz-box .mod-course .next {
    right: -5px; }

  .clazz-box .mod-course .prev em {
    background-position: -34px -24px; }

  .clazz-box .mod-course .next em {
    background-position: -32px -7px; }

  .clazz-box .mod-course .prev:hover {
    color: #189cfb; }

  .clazz-box .mod-course .next:hover {
    color: #189cfb; }

  .clazz-box .mod-course .prev:hover em {
    background-position: -34px -41px; }

  .clazz-box .mod-course .next:hover em {
    background-position: -33px -60px; }

  .clazz-box .w-checkbox {
    margin-right: 5px; }

  .clazz-box .mod-course .newinner .w-checkbox {
    margin-top: 0px; }

  .clazz-box .mod-course .newinner .cannotSelected {
    color: #ccc; }
</style>
