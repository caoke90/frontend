import ajax from './ajax';
import Bus from '@/marvel/bus'
import sa from '@/utils/sensorsdata'

function sensorSendLog(operastion_Type, currentScene, questionID_List){
  sa.track('onlineEn_Assignment_SelectDeleteContent',{
    operastion_Type,
    currentScene,
    questionID_List
  })
}
/*
 * 购题车打点
 * 避免与业务逻辑混淆
 * */
const logControl = {
  cartLog: function(type,logData) {
    let typeMap = {
      'add_single' : '单题选入',
      'add_all' : '全部选入',
      'remove_single' : '单题移除',
      'remove_all' : '全部移除'
    }
    let ques = Array.isArray(logData) ? logData : [logData];
    let questionID_List = [];
    let actionType = typeMap[type];
    ques.forEach((ques,index) => {
      if(index >= 99) return
      questionID_List.push(ques.id)
    });
    sensorSendLog(actionType, window.currentScene, questionID_List)
  }
}

const Cart = {
  /*
   * 购题车数据 oriCardInfo
   *
   * */
  oriCardInfo: null,
  cart_type: 'normal',
  upperLimitCount: 100,

  //刷新数据
  refresh:async function(){
    this.oriCardInfo = null;
    await this.getCardInfo();
  },
  // 获取大题数量
  getBigNum:function(){
    let num=0;
    this.oriCardInfo.blocks.forEach( (item) => {
      num+=item.items.length
    })
    return num;
  },
  /*
   * 初始化
   * 1、请求购题车原始数据
    */
  getCardInfo: async function (cart_type) {
    if (!this.oriCardInfo) {
      this.cart_type=cart_type||'normal'
      this.oriCardInfo = await this._getCardInfo("normal")
    }
    this.updateCart();
    return this.oriCardInfo;
  },
  _getCardInfo: async function () {
    const {data} = await ajax.post('/pc/v1/cart/info', {
      cart_type: this.cart_type
    });
    if (data.result !== 'success') {
      //存在异常,接口请求失败
      // alert(data.message)
      return {
        blocks:[]
      };
    }
    return {
      blocks:data.data.blocks
    };
  },
  /*
   * 初始化
   * 输出购题车需要的展示数据给原生
    */
  toCartJSON: function () {
    let cartRows = [],
      count = 0,
      minutes = 0,
      question_id = [];
    const cacheUni={}
    this.oriCardInfo.blocks.forEach( (item) =>{
      if(!cacheUni[item.category.name]){
        cacheUni[item.category.name]={
          block_name: item.category.name,
          block_value:"0道"
        }
      }
      const obj = cacheUni[item.category.name];
      let tempCount = 0;
      item.items.forEach(function (item2) {
        tempCount += item2.count;
        count += item2.count;
        minutes += item2.duration
        question_id.push(item2.id)
      });
      obj.block_value = (parseInt(obj.block_value)+tempCount)+'道';

    });
    for(let k in cacheUni){
      cartRows.push(cacheUni[k])
    }

    minutes = Math.ceil(minutes/60);
    return {
      question_count: count,
      duration_minutes:minutes,
      cart_detail: cartRows,
      question_id: question_id
    }
  },

  /*
  * 购题车交互与壳
  * */
  updateCart: function () {

    const cartRows = this.toCartJSON();
    this.cartRows=cartRows;
    Bus.$emit('updateCart',cartRows)

  },
  /*
    * 交互部分
    * 批量添加题目
    *
    * Method Post
    * 名称 类型 含义
    * cart_type	string	购题车类型
    * blocks	json	购题车压缩信息
    *
    *返回
    * duration int	预估做题时间秒
    * question_count	int	题量
    * */
  add_questions: async function (question) {
    if(!this.oriCardInfo){return;}
    // 缓存购题车
    const cacheOriCardInfo=JSON.parse(JSON.stringify(this.oriCardInfo))
    const quesBigNum=this.getBigNum();

    const blocks = Array.isArray(question) ? question : [question];
    const diffBlocks=[];
    blocks.forEach((ques) => {
      const indexArr = this.indexOf(ques);
      if (indexArr.length === 2) {
        console.log("Cart已存在该题，不能重复添加")
      }
      else if (indexArr.length === 1) {
        this.oriCardInfo.blocks[indexArr[0]].items.push({
          "id": ques.id,
          "duration": ques.seconds,
          "type": ques.questionTypeId,
          "count": ques.subQuestions.length || 1
        });
        diffBlocks.push(ques)
      }
      else if (indexArr.length === 0) {
        this.oriCardInfo.blocks.push({
          "category": ques.category,
          "items": [{
            "id": ques.id,
            "duration": ques.seconds,
            "type": ques.questionTypeId,
            "count": ques.subQuestions.length || 1
          }]
        });
        diffBlocks.push(ques)
      }
    });
    const blocksArr = [];
    const json = {};
    diffBlocks.forEach((ques) => {
      const [k1, k2] = this.indexOf(ques);
      if (!json[k1]) {
        json[k1] = {
          category: this.oriCardInfo.blocks[k1].category,
          items: []
        };
        blocksArr.push(json[k1])
      }
      json[k1].items.push(this.oriCardInfo.blocks[k1].items[k2]);
    });

    //是否超过数量
    if ((quesBigNum+diffBlocks.length) > this.upperLimitCount) {
      //还原购题车
      this.oriCardInfo=cacheOriCardInfo;
      // 需要把刚刚那些题目diffBlocks状态变更为false 在具体页面
      await this.updateCart()
      // 超过要添加的数量
      alert("题量过多，已超过上限100道，请分成多次推荐~");
      return false;
    }

    const addRes = await this._add_questions({
      cart_type: this.cart_type,
      blocks: blocksArr,
    });
    if(addRes== false){
      this.oriCardInfo=cacheOriCardInfo;
    }
    await this.updateCart()
  },
  _add_questions: async function ({cart_type, blocks}) {
    let questionIDList = []
    blocks.forEach((item, index)=>{
      item.items.forEach((im, i)=>{
        questionIDList.push(im.id)
      })
    })
    const {data} = await ajax.post('/pc/v1/cart/add_questions', {
      cart_type: cart_type,
      blocks: JSON.stringify(blocks)
    })
    if (data.result !== 'success') {
      //存在异常,接口请求失败
      alert(data.message);
      return false;
    }
    return "ok";
  },
  hasQuestion: function (question) {
    return this.indexOf(question).length === 2;
  },
  //查询题目位置
  indexOf: function (question) {
    const index = [];
    if (this.oriCardInfo.blocks) {
      for (let k = 0; k < this.oriCardInfo.blocks.length; k++) {
        const item = this.oriCardInfo.blocks[k]
        if (item.category.name === question.category.name&&item.category.type === question.category.type) {
          index.push(k);
          for (let k2 = 0; k2 < item.items.length; k2++) {
            const item2 = item.items[k2];
            if (item2.id === question.id) {
              index.push(k2);
              break;
            }
          }
          break;
        }
      }
    }
    return index;
  },
  indexOfByName:function (question) {
    const index = [];
    if (this.oriCardInfo.blocks) {
      for (let k = 0; k < this.oriCardInfo.blocks.length; k++) {
        const item = this.oriCardInfo.blocks[k]
        if (item.category.name === question.category.name) {
          index.push(k);
          break;
        }
      }
    }
    return index;
  },

  /*
    * 交互部分
    * 批量删除题目
    *
    * Method Post
    * 名称 类型 含义
    * cart_type	string	购题车类型
    * blocks	json	购题车压缩信息
    *
    *返回
    * duration	int	预估做题时间秒
    * question_count	int	题量
    * */
  remove_questions: async function (question) {
    if(!this.oriCardInfo){return;}
    const blocks = Array.isArray(question) ? question : [question];
    const diffBlocks=[];
    const blocksArr = [];
    const json = {};
    blocks.forEach((ques) => {
      const indexArr = this.indexOf(ques);

      if (indexArr.length===2) {

        const [k1,k2]=indexArr;

        if (!json[k1]) {
          json[k1] = {
            category: this.oriCardInfo.blocks[k1].category,
            items: []
          };
          blocksArr.push(json[k1])
        }
        json[k1].items.push(this.oriCardInfo.blocks[k1].items[k2]);
        diffBlocks.push(ques)
      }
      else {
        console.log(question,'cart题目不存在')
      }
    });

    diffBlocks.forEach((ques) => {
      const indexArr = this.indexOf(ques)
      if (indexArr.length == 2) {
        this.oriCardInfo.blocks[indexArr[0]].items.splice(indexArr[1], 1)
        if(this.oriCardInfo.blocks[indexArr[0]].items.length==0){
          this.oriCardInfo.blocks.splice(indexArr[0],1)
        }
      } else if (indexArr.length == 1) {
        console.log("Cart类别下，不存在该题")
      } else if (indexArr.length == 0) {
        console.log("Cart不存在该题")
      }
    });


    await this._remove_questions({
      cart_type: this.cart_type,
      blocks: blocksArr,
    });
    await this.updateCart()
  },
  _remove_questions: async function ({cart_type, blocks}) {
    let questionIDList = []
    blocks.forEach((item, index)=>{
      item.items.forEach((im, i)=>{
        questionIDList.push(im.id)
      })
    })
    sensorSendLog('单题移除', window.currentScene, questionIDList)
    const {data} = await ajax.post('/pc/v1/cart/remove_questions', {
      cart_type: cart_type,
      blocks: JSON.stringify(blocks)
    });
    if (data.result !== 'success') {
      //存在异常,接口请求失败
      // alert(data.message)
      return;
    }
    return 'ok';
  },
  remove_category:async function(ques){
    if(!this.oriCardInfo){return;}

    const cacheblocksArr=[]
    while(true){
      const indexArr=this.indexOfByName(ques)
      if(indexArr.length==0){
        break;
      }else{
        cacheblocksArr.push(this.oriCardInfo.blocks.splice(indexArr[0],1)[0])
      }
    }

    await this._remove_questions({
      cart_type: this.cart_type,
      blocks: cacheblocksArr,
    });
    await this.updateCart()
  },
  /*
    * 交互部分
    * 清空购题车
    *
    * Method Post
    * 名称 类型 含义
    * cart_type	string	购题车类型
    *
    *返回
    * duration	int	预估做题时间秒
    * question_count	int	题量
    * */
  flush: async function () {
    this.oriCardInfo.blocks = [];
    await this._flush();
    await this.updateCart()
  },
  _flush: async function () {
    const {data} = await ajax.post('/pc/v1/cart/flush', {
      cart_type: this.cart_type
    });
    if (data.result !== 'success') {
      //存在异常,接口请求失败
      // alert(data.message)
      return;
    }
    return 'ok';
  },


}

// 购物车交互部分
Bus.$on('Cart', function ({type, ques, currentScene}) {
  if (type == 'add_questions') {
    Cart.add_questions(ques)
    logControl.cartLog('add_single',ques)
  } else if (type == 'add_questions_all') {
    Cart.add_questions(ques)
    logControl.cartLog('add_all',ques)
  } else if (type == 'remove_questions') {
    Cart.remove_questions(ques)
    logControl.cartLog('remove_single',ques)
  } else if (type == 'remove_questions_all') {
    Cart.remove_questions(ques)
    logControl.cartLog('remove_all',ques)
  } else if (type == 'flush') {
    Cart.flush()
  } else if (type == 'preview-remove-all') {
    let questionIDList = []
    Bus.preview.questions.forEach((item, index)=>{
      questionIDList.push(item.id)
    })
    sensorSendLog('全部移除', window.currentScene, questionIDList)
    Cart.flush()
  } else if (type == 'remove_category') {
    Cart.remove_category(ques)
  }
})

export default Cart;

