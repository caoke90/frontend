/**
 * @author junlin.yan
 * @date 2018/6/20
 * @description 选择填空题型
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

export default class ChoiceBlankQuestion extends SubQuestion {
  constructor(question, index) {
    super(question, index);

    // 选项类型
    this.optionType = this.$qs.optionType || 'other';

    let wordType = [2030037, 2031024, 2031025]; // 连词成句、词汇造句、句子拼写
    let wordTypeNew = [203007013, 203017009, 203017004]; // 新题型：  词汇造句、句子拼写
    // TODO 这些题型选项设置为单词
    let wordOption = [].concat(wordType, wordTypeNew);

    if (wordOption.includes(this.questionType2Id)) {
      this.optionType = OPTION_TYPE.WORD;
    }

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
      this.$qs.answers.forEach((item, index) => {
        let answer = item.answer;
        this.answers.push(answer);
      });
    }


    if (this.$qs.options) {
      this.$qs.options.forEach((opt, optIndex) => {
        let option = new ChoiceOption(opt, this.$qs, optIndex);
        this.options.push(option);
        this.optionPreviewList.push(option.option);
      });
    }
  }

  // 获取正确答案
  getAnswerList() {
    return this.answerList(this.answers);
  }

  answerList(arr) {
    let answerArray = [];
    if (arr.length > 0) {
      // TODO 单词拼写新老题型
      let wordSpellType = [2031023, 203017000];
      let isWordSpell = wordSpellType.includes(this.questionType2Id);

      if (isWordSpell) {
        let ansArr = [];
        arr.forEach((ans, index) => {
          let str = this.options[ans.answer || ans].option || '';
          ansArr.push(str);
        });
        answerArray.push(ansArr.join(''));
      } else if (this.optionTypeMark === 0) {
        let ansArr = [];
        arr.forEach((ans, index) => {
          let str = this.options[ans.answer || ans].option || '';
          ansArr.push(str);
        });
        answerArray.push(ansArr.join('; '));
      } else {
        arr.forEach((ans, index) => {
          let str = (index + 1) + '. ' + this.options[ans.answer || ans].option || '';
          answerArray.push(str);
        });
      }
    }
    return answerArray;
  }
}
