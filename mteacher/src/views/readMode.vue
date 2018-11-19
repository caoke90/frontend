<template>
  <div class="container">
    <div class="read-list">
      <div class="read-info" v-for="(item,index) in lists" @click="select(index)"
           :class="{active:speaking_mode ===item.type}">
        <h5>{{item.name}}</h5>
        <p>{{item.des}}</p>
        <i class="icon-selected" v-show="speaking_mode===item.type"></i>
      </div>
    </div>
    <footer>
      <button @click="submit">确定</button>
    </footer>
  </div>
</template>

<script>
  import ajax from '../api/ajax';
  import Bus from '../marvel/bus';
  import {showToast} from '../common/js/external';
  import {getInitParams,updateTitle,showLoading} from '../common/js/external/index';
  import {sendLog} from '../common/js/logger';
  document.body.addEventListener('touchstart', function () { });//为模拟h5 :active样式
  export default {
    name: "readMode",
    data() {
      return {
        currentValue: '',
        speaking_mode: 1,
        lists: [
          {
            type: 1,
            name: '考试模式',
            des: '不支持跳过和重做，全部提交后显示分数'
          },
          {
            type: 2,
            name: '练习模式',
            des: '支持跳过和重做，单题做完即显示分数'
          }
        ]
      }
    },
    created: function () {
        updateTitle('口语作答模式设置');
        this.init();
    },
    methods: {
      init: function () {
        let params = getInitParams();
        this.speaking_mode=Number(params.speaking_mode);
        this.currentValue=this.speaking_mode==1?'考试模式':'练习模式';
      },
      select: function (index) {
        this.currentValue = this.lists[index].name;
        this.speaking_mode = this.lists[index].type;
      },
      submit: async function () {
        ajax.index=2;
        showLoading(true);
        const {data} = await ajax.post('/assign/changeSpeakingMode', {
          mode: this.speaking_mode
        });
        if (data.result === 'success') {
          showLoading(false);
          showToast('已切换为' + this.currentValue);
          sendLog('','',{event:'onlineEn_SpeakAndRead_setSpeak',logData:{answerType:this.currentValue}});
          setTimeout(function () {
            if (window.external && window.external.disMissView) {
              window.external.disMissView();
            }
          }, 1000)
        } else {
          console.log('error');
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="less" scoped>
  .container {
    max-width: 750px;
    margin: 0 auto;
  }

  .read-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40/100rem;
    .read-info {
      width: 670/100rem;
      padding: 24/100rem;
      border: 1px solid #fff;
      margin-bottom: 40/100rem;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 12/100rem;
      -webkit-user-select:none;
      -moz-user-select:none;
      user-select:none;
      position: relative;
      h5 {
        font-size: 32/100rem;
        margin-bottom: 8/100rem;
      }
      p {
        font-size: 24/100rem;
      }
      .icon-selected {
        width: 64/100rem;
        height: 64/100rem;
        display: block;
        background: url("../assets/img/selected.png") no-repeat;
        background-size: cover;
        position: absolute;
        right: -1px;
        top: -1px;
      }
    }
    .active {
      border: 1px solid #007AFF;
      color: #007AFF;
      border-radius: 12/100rem;
    }
  }

  footer {
    width: 100%;
    height: 120/100rem;
    background: #FFFFFF;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      width: 670/100rem;
      height: 80/100rem;
      border-radius: 100/100rem;
      background-color: #007AFF;
      color: #fff;
      border: none;
      outline: none;
      font-size: 32/100rem;
      outline: none;
      -webkit-user-select:none;
      -moz-user-select:none;
      user-select:none;
      &:active{
           background: #0062D9;
       }
    }
  }
</style>
