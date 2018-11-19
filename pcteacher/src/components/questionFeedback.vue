<template>
  <modal :isshow="isShow" @close="close">
    <template slot="title">{{title}}</template>
    <template slot="content">
      <div id="feedbackBox">
        <div class="h-feedback-box">
          <template v-if="!feedbackSuccess">
            <div class="type"><span>错误类型：</span>
              <template v-for="item in feedbackTypes">
                <p :class="{'active':item.selected}" @click="toggleFeedbackType(item)"><span
                  class="w-checkbox w-magR-5"></span>{{item.name}}</p>
              </template>
            </div>
            <div class="describe w-magT-20">
              <div>错误描述（必填）：</div>
              <div>
                <textarea placeholder="" maxlength="200" v-model="feedbackDec"></textarea>
                <p style="text-align:right">
                  <span class="tip" v-show="!feedbackDec.length && feedbackTipVisible">错误描述不能为空</span>
                  还可以输入{{200-feedbackDec.length}}个字
                </p>
              </div>
            </div>
            <div class="btn-box">
              <a href="javascript:void(0);" class="w-btn w-btn-green w-btn-small" style="margin-right:35px"
                 @click="close">取消</a>
              <a href="javascript:void(0);" class="v-to-exam w-btn w-btn-small" @click="submit">提交</a>
            </div>
          </template>
          <template v-if="feedbackSuccess">
            <div>
              <div style="text-align:center">提交成功，感谢您的支持！</div>
              <div class="btn-box">
                <a href="javascript:void(0);" class="v-to-exam w-btn w-btn-small" @click="close">知道了</a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
  import Bus from '../marvel/bus';
  import ajax from '../api/ajax';
  import modal from './modal';
  import {camel2UnderlineObj} from '../common/js/utils';

  export default {
    name: "questionFeedback",
    components: {modal},
    data() {
      return {
        title: '题目反馈',
        isShow: false,
        feedbackTypes: [
          {name: "题干错误", selected: false, info: 'stem'},
          {name: "解析错误", selected: false, info: 'resolution'},
          {name: "选项错误", selected: false, info: 'option'}
        ],
        feedbackDec: '',
        feedbackTipVisible: false,
        questionId: '',
        feedbackSuccess: false
      }
    },
    methods: {
      init(question) {
        this.isShow = true;
        this.questionId = question.id;
      },
      resetData() {
        this.feedbackTypes.forEach(function (type) {
          type.selected = false;
        });
        this.feedbackDec = '';
        this.feedbackTipVisible = false;
        this.questionId = '';
        this.feedbackSuccess = false;
      },
      close() {
        this.isShow = false;
        this.resetData();
      },
      toggleFeedbackType(type) {
        type.selected = !type.selected;
      },
      submit() {
        if (this.feedbackDec.length > 0) {
          let typeArr = [];
          let infoArr = [];
          this.feedbackTypes.forEach(function (type) {
            if (type.selected) {
              typeArr.push(type.name);
              infoArr.push(type.info);
            }
          });
          let config = {
            question_id: this.questionId,
            type: typeArr.join(","),
            feedback_type: 1, //固定
            detail: this.feedbackDec
          };
          console.log(config);
          ajax.post('/extra/errorCorrection', camel2UnderlineObj(config)).then((resp) => {
            if (resp.data.result == 'success') {
              this.feedbackSuccess = true;
            } else {
              Bus.calert.alert({
                message: '提交失败'
              });
            }
          }, (data) => {
            Bus.calert.alert({
              message: '提交失败'
            });
            console.log(data);
          });

        } else {
          this.feedbackTipVisible = true;
        }
      }
    },
    created: function () {
      Bus.questionFeedback = this;
    }
  }
</script>
<style rel="stylesheet/scss" type="text/css" lang="scss">

</style>
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  #feedbackBox {
    width: 500px;
  }

  .h-feedback-box {
    padding: 20px;
    padding-top: 0;
    line-height: 30px;
  }

  .h-feedback-box .type p {
    display: inline-block;
    margin-left: 30px;
    cursor: pointer;
  }

  .h-feedback-box .describe textarea {
    width: 98%;
    height: 113px;
    margin-top: 5px;
  }

  .h-feedback-box .describe .tip {
    float: left;
    font-size: 12px;
    color: #fb714c;
  }

  .h-feedback-box .btn-box {
    margin-top: 30px;
    text-align: center;
  }
</style>
