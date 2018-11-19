/**
 * @author junlin.yan
 * @date 2018/6/20
 * @description 子题目父类，所有具体的题型类继承自它
 */

import {
  OralDictDialoguesBasic,
  OralDictFollowRead,
  OralDictFollowReadBasic,
  OralDictRead,
  OralDictRoleRead,
  OralDictSubjective
} from './Base';
import {blankReplace} from '../../common/js/questionUtils';

class SubQuestion {
  constructor(question, subqIndex) {
    let subQquestion = question.content.subContents[subqIndex];
    // {number}
    this.id = question.id || '';
    // {number} 小题编号
    this.subqIndex = subqIndex;
    this.subjectId = question.subjectId;
    this.questionTypeId = question.questionTypeId;
    this.questionType2Id = question.questionType2Id;

    // {number} 小题题型，也就是题目类型
    this.subContentTypeId = subQquestion.subContentTypeId;
    // {string} 小题题干
    this.content = subQquestion.content || '';
    this.showContent = this.content;
    // {string} 小题解析
    this.analysis = subQquestion.analysis || '';
    this.analysisList = subQquestion.analysisList || [];
    // {string} 选项类型, 前端根据不同类型确定展示方式 {word:单词, sentence:句子, image:图片, math:数学, other:其他}
    this.optionType = subQquestion.optionType || '';
    // {Object} 题目选项
    this.options = [];
    // {Object[]} 每道题目或子题的答案列表
    this.answers = subQquestion.answers || [];
    // {string} 口语情景提示
    this.sceneDescription = subQquestion.sceneDescription || (subQquestion.oralDict && subQquestion.oralDict.sceneDescription ? subQquestion.oralDict.sceneDescription : '');


    // {number} 是否显示选项序号
    this.hideOptionNumber = subQquestion.hideOptionNumber || 1;
    // {string} 听力题资源路径
    this.listenUrl = subQquestion.listenUrl;
    // {string} 听力题资源名称
    this.listenName = subQquestion.listenName;
    // {number} 听力题资源时长
    this.listenSeconds = subQquestion.listenSeconds;
    // {number} 审题时长（听力题专用字段）
    this.exploreSeconds = subQquestion.exploreSeconds;
    // {number} 答题时长
    this.answersSeconds = subQquestion.answersSeconds;
    // {string} 小题的图片
    this.pictureUrl = subQquestion.pictureUrl;
    // {OralDict}口语专用题库数据结构
    this.oralDict = this.parseOralDict(subQquestion.oralDict);

    // {number[]} 题目提交方式 {0: 在线作答， 1: 拍照， 2: 录音， 3: 口语}
    this.submitWays = subQquestion.submitWays || [];
    // {boolean} 是否可以在线作答
    this.canAnswer = this.isCanAnswer();

    this.$qs = subQquestion;
    this.init();
  }

  init() {
    if (this.showContent) {
      let showContent = this.showContent;
      let subContentTypeId = this.subContentTypeId;
      let questionType2Id = this.questionType2Id;
      let indexStart = 0;
      showContent = blankReplace(showContent, subContentTypeId, questionType2Id, indexStart);
      this.showContent = showContent;
    }

    if (!this.analysis && this.analysisList.length) {
      let analysisArr = [];
      this.analysisList.forEach(function (an) {
        if (an.text && an.text != '<p><br></p>' && an.analysisTypeId != "AT_20300000033573") {
          analysisArr.push(an.text);
        }
      });
      this.analysis = analysisArr.join('<br>');
    }
  }

  /**
   * 判断试题题型是否是可以在线作答的题型
   * 拍照的题，以及数学的填空题，不可在线作答
   * submitWays:0：直接作答；1：拍照；2：录音；3：口语；
   */
  isCanAnswer() {
    if (this.submitWays.includes(1) || this.submitWays.includes(2) || ([102, 202, 302].includes(this.subjectId) && this.subContentTypeId == 4)) {
      return false;
    }
    return true;
  }

  parseOralDict(oralDict) {
    let oralDictObj = null;
    let subContentTypeId = this.subContentTypeId;
    switch (subContentTypeId) {
      case 14:
        oralDictObj = new OralDictFollowReadBasic(oralDict);
        break;
      case 23:
        oralDictObj = new OralDictDialoguesBasic(oralDict);
        break;
      case 18:
        oralDictObj = new OralDictSubjective(oralDict);
        break;
      case 19:
        oralDictObj = new OralDictRead(oralDict);
        break;
      case 20:
        oralDictObj = new OralDictRoleRead(oralDict);
        break;
      case 21:
        oralDictObj = new OralDictFollowRead(oralDict);
        break;
    }
    return oralDictObj;
  }
}

export default SubQuestion;
