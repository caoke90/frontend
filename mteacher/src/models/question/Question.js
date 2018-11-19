/**
 * @author junlin.yan
 * @date 2018/6/20
 * @description Test file template
 */
import {getDifficultyStr, blankReplace} from '../../common/js/questionUtils';
import {getOrderBy2Id} from '../../api/order';
import {ListenFile, KnowledgePointsNew} from './Base';
import ChoiceQuestion from './Choice';
import BlankQuestion from './Blank';
import JudgeQuestion from './Judge';
import ChoiceBlankQuestion from './ChoiceBlank';
import SortQuestion from './Sort';
import OralBasicQuestion from './OralBasic';
import OralQuestion from './Oral';
import SubjectiveQuestion from './Subjective';
import practiceTypeDict from '../../common/js/practiceTypeDict';

export default class Question {
  constructor(question, qindex) {
    // 兼容题型ID，优先使用新的，如果没有使用旧的
    question.questionTypeId = question.newContentTypeId || question.contentTypeId;
    question.questionType2Id = question.newContentSubtypeId || question.contentType2Id;

    this.qindex = question.qindex || qindex;
    this.category = question.category || {};
    // {boolean} 是否使用过
    this.isUsed = Boolean(question.isUsed);
    // {number} 推荐时 区分的题目类型  {1:词汇, 2:跟读, 3:普通题(包括同步与教辅)}
    this.assignType = Boolean(question.assignType);
    // 失分率
    this.lossRate = question.lossRate || '';

    // {string} 题目id
    this.id = question.id;
    // {number} 学科id
    this.subjectId = question.subjectId;
    // {number} {1:复合题, 0:非复合题}
    this.complex = parseInt(question.complex);


    // {number} 一级题型id,
    this.contentTypeId = question.contentTypeId;
    // {number} 二级题型id
    this.contentType2Id = question.contentType2Id;
    // {number} 一级题型id, newContentTypeId 新
    this.newContentTypeId = question.newContentTypeId;
    // {number} 二级题型id, newContentSubtypeId  新
    this.newContentSubtypeId = question.newContentSubtypeId;
    // 兼容题型ID
    this.questionTypeId = question.questionTypeId;
    this.questionType2Id = question.questionType2Id;


    // {number} 题目难度 {0:未知难度, 1：易, 2：较易, 3：中, 4：较难, 5：难}
    this.difficultyInt = question.difficultyInt;
    // {string} 作答说明
    this.description = question.description || '';
    // {ListenFile} 作答说明音频  口语题专用字段
    this.descriptionFile = null;
    // {string} 口语情景提示
    this.sceneDescription = question.sceneDescription || '';
    /**
     * 取出题目内容
     */
    let content = question.content || {};
    // {string} 大题题干
    this.content = content.content || '';
    this.showContent = this.content;
    // {string} 听力原文、原文翻译
    this.contentDesc = content.contentDesc || '';
    // 题目解析
    this.analysis = content.analysis || '';
    // {SubQuestion[]} 对于复合题，这里面存储的是各个小题，对于非复合题，这里只存储一条数据，也就是具体题目信息
    this.subQuestions = [];
    // 知识点
    this.knowledgePoints = [];
    // {Object[]} 正确答案
    this.answers = question.answers || [];

    // {string} 听力题资源路径
    this.listenUrl = question.listenUrl;
    // {string} 听力题资源名称
    this.listenName = question.listenName;
    // {number} 听力题资源时长
    this.listenSeconds = question.listenSeconds;
    // {number} 审题时长（听力题专用字段）
    this.exploreSeconds = question.exploreSeconds;
    // {number} 准备答题时长  口语题专用字段
    this.readySeconds = question.readySeconds;
    // {number} 听力题答题时长（出题时设定值，用来限制学生答题时间）
    this.answersSeconds = question.answersSeconds;
    // {number} 题目作答时间
    this.seconds = question.seconds;
    // {number[]} 题目提交方式 {0: 在线作答， 1: 拍照， 2: 录音， 3: 口语}
    this.submitWays = question.submitWays || [];
    // {boolean} 用于判断是否需要批改
    this.subjective = Boolean(question.subjective);

    // {Object} 题目类型
    this.contentType = question.contentType || {};
    // {Object} 题目类型 （中学）
    this.majorContentType = question.majorContentType || {};
    // {string} 单词id
    this.wordId = question.wordId || '';
    this.wordData = question.wordData || null;
    this.wordName = this.wordData ? this.wordData.name : '';

    // {boolean} 是否被选择
    this.selected = Boolean(question.selected) || false;
    this.$qs = question;

    // {boolean} 是否可以在线作答
    this.canAnswer = true;
    this.init();

    /**
     * 自加的属性
     */
    // {string} 题目难度文本
    this.difficultyStr = getDifficultyStr(this.difficultyInt);
    // {string[]} 显示的标签列表 失分率等级最高
    this.showTagsList = [];
    if (this.lossRate) {
      let tag = {
        text: this.lossRate + ' 失分率 ',
        type: 'loss-rate'
      };
      this.showTagsList.push(tag);
    } else if (!this.canAnswer) {
      let tag = {
        text: '需批改',
        type: 'mark'
      };
      this.showTagsList.push(tag);
    } else if (this.isUsed) {
      let tag = {
        text: '使用过',
        type: 'used'
      };
      this.showTagsList.push(tag);
    }

    let contentTypeName = this.contentType ? this.contentType.name : '';
    if (!this.contentType.name) {
      contentTypeName = getOrderBy2Id(this.questionType2Id)[2]
    }

    let showTypeTitleInfo = [contentTypeName, this.difficultyStr];
    this.knowledgePoints.forEach((knowledgePoint) => {
      if (knowledgePoint.name) {
        showTypeTitleInfo.push(knowledgePoint.name);
      }
    });
    this.showTypeTitle = showTypeTitleInfo.join(' / ');
  }

  init() {
    if (this.category) {
      this.category = Object.assign({}, this.category);
      Object.keys(practiceTypeDict).forEach((practiceType) => {
        let questionType = practiceTypeDict[practiceType];
        if (questionType.indexOf(String(this.questionType2Id)) > -1) {
          this.category.type = practiceType;
        }
      });
    }

    this.knowledgePoints = [];
    if (this.$qs.knowledgePointsNew) {
      this.$qs.knowledgePointsNew.forEach((knowledgePoint) => {
        let knowledgePointObj = new KnowledgePointsNew(knowledgePoint);
        this.knowledgePoints.push({id: knowledgePointObj.id, name: knowledgePointObj.name});
      });
    }
    if (this.$qs.descriptionFile) {
      this.descriptionFile = new ListenFile(this.$qs.descriptionFile);
    }
    this.subQuestions = [];
    if (this.$qs.content && this.$qs.content.subContents) {
      this.$qs.content.subContents.forEach((subq, subqIndex) => {
        let qindex = subqIndex;
        let subQuestion = null;
        switch (subq.subContentTypeId) {
          case 1:
          case 2:
          case 3:
            subQuestion = new ChoiceQuestion(this.$qs, qindex);
            break;
          case 4:
            subQuestion = new BlankQuestion(this.$qs, qindex);
            break;
          case 5:
            subQuestion = new JudgeQuestion(this.$qs, qindex);
            break;
          case 6:
            subQuestion = new SubjectiveQuestion(this.$qs, qindex);
            break;
          case 9:
            subQuestion = new SortQuestion(this.$qs, qindex);
            break;
          case 10:
            subQuestion = new ChoiceBlankQuestion(this.$qs, qindex);
            break;
          case 14:
          case 23:
            subQuestion = new OralBasicQuestion(this.$qs, qindex);
            break;
          case 18:
          case 19:
          case 20:
          case 21:
            subQuestion = new OralQuestion(this.$qs, qindex);
            break;
          default:
            subQuestion = {id: 'notype'};
            break;
        }
        if (!subQuestion.canAnswer) {
          this.canAnswer = subQuestion.canAnswer;
        }

        this.subQuestions.push(subQuestion);
      });
    }

    // 情景对话题干显示情景提示字段
    if (this.questionType2Id == '203016005') {
      this.showContent = this.sceneDescription;
    }

    if (this.showContent) {
      let showContent = this.showContent;
      let subContentTypeId = this.subQuestions[0].subContentTypeId;
      let questionType2Id = this.questionType2Id;
      let indexStart = 0;
      showContent = blankReplace(showContent, subContentTypeId, questionType2Id, indexStart);
      this.showContent = showContent;
    }

    // 兼容非复合题音频数据
    let noAudio = [203017000, 203017001, 203017002]; // 不需要显示音频的题型
    if (noAudio.indexOf(this.questionType2Id) == -1 && (this.complex == 0 && !this.listenUrl) && this.subQuestions[0].listenUrl) {
      this.listenName = this.subQuestions[0].listenName;
      this.listenSeconds = this.subQuestions[0].listenSeconds;
      this.listenUrl = this.subQuestions[0].listenUrl;
      this.contentDesc = this.contentDesc || this.subQuestions[0].contentDesc;
    }
  }

  // 判断是否是口语题
  isOral() {
    if (this.subQuestions.length) {
      if ([18, 19, 20, 21].includes(this.subQuestions[0].subContentTypeId)) {
        return true;
      }
    }
    return false;
  }

  // 判断是否是基本口语题
  isBasicOral() {
    if (this.subQuestions.length) {
      if ([14, 23].includes(this.subQuestions[0].subContentTypeId)) {
        return true;
      }
    }
    return false;
  }
}
