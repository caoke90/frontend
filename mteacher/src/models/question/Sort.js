/**
 * @author junlin.yan
 * @date 2018/6/26
 * @description 排序题型
 */
import SubQuestion from './SubQuestion';
import {ChoiceOption} from './Base';


const OPTION_TYPE = {
  WORD: 'word', //英语单词
  SENTENCE: 'sentence', //英语句子
  IMAGE: 'img', //英语图片
  MATH: 'math', //数学
  OTHER: 'other' //其他
};

export default class SortQuestion extends SubQuestion {
  constructor(question, index) {
    super(question, index);

    // 选项类型
    this.optionType = this.$qs.optionType || 'other';
    // 选项预览列表
    this.optionPreviewList = [];
    // 某些选项类型有相同的表现，为了使用方便，增加一个optionTypeMark字段
    this.optionTypeMark = 4;
    switch (this.optionType) {
      case OPTION_TYPE.WORD:
        this.optionTypeMark = 0;
        break;
      case OPTION_TYPE.SENTENCE:
        this.optionTypeMark = 1;
        break;
      case OPTION_TYPE.IMAGE:
        this.optionTypeMark = 2;
        break;
      case OPTION_TYPE.MATH:
        this.optionTypeMark = 3;
        break;
      case OPTION_TYPE.OTHER:
        this.optionTypeMark = 4;
        break;
      default:
        this.optionTypeMark = 4;
        break;
    }

    this.options = [];
    this.answers = [];
    if (this.$qs.answers) {
      let answerString = this.$qs.answers[0].answer;
      let answerArray = answerString.split(',');

      answerArray.forEach((item, index) => {
        this.answers.push(item);
      });
    }


    if (this.$qs.options) {
      this.$qs.options.forEach((opt, optIndex) => {
        let option = {
          option: opt.option,
          index: optIndex
        };
        this.options.push(option);
        let opIndexStr = '';
        if (this.optionTypeMark != 2) {
          opIndexStr = (optIndex + 1) + '. ';
        }
        this.optionPreviewList.push(opIndexStr + option.option);
      });
    }
  }

  // 获取正确答案
  getAnswerString() {
    let ansArr = this.getAnswerList(this.answers);
    return ansArr.join(' ');
  }

  getAnswerList(arr) {
    let answerArray = [];
    if (arr.length > 0) {
      arr.forEach((ans, index) => {
        let ansPos = parseInt(ans) + 1;
        answerArray.push(ansPos);
      });
    }
    return answerArray;
  }
}
