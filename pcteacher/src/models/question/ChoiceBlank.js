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
    let wordTypeNew = [203007013, 203017009, 203017004]; // 新题型：连词成句、词汇造句、句子拼写
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

    let needParseType = [2031023]; // 单词拼写
    let needParseNewType = [203017000]; // 新题型：单词拼写
    // TODO 这些题型有图片，要正则解析出图片、英文、中文
    let needParseTypeArray = [].concat(needParseType, needParseNewType);
    if (needParseTypeArray.includes(this.questionType2Id)) {
      let contentDetail = this.parseContent();
      this.contentImg = contentDetail.contentImg;
      this.contentEn = contentDetail.contentEn;
      this.contentCn = contentDetail.contentCn;
      // 单词拼写替换空为正确答案
      if ([2031023, 203017000].includes(this.questionType2Id)) {
        let word = this.getAnswerString();
        let contentEn = '';
        for (let i = 0; i < word.length; i++) {
          contentEn += `<span class="content-blank-underline">${word[i]}</span>`;
        }
        if (contentEn) {
          this.contentEn = '<p>' + contentEn + '</p>';
        }
      }

      this.showContent = '<p class="img"><img src="' + this.contentImg + '"></p>' + this.contentEn + this.contentCn
    }
  }

  getAnswerString() {
    let ansArr = this.getAnswerList();
    return ansArr.join('; ');
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

  // 解析单词拼写等题型题目内容
  parseContent() {
    let contentDetail = {
      contentImg: '',
      contentEn: '',
      contentCn: ''
    };

    // 全部的content文本
    let layoutHtml = this.showContent;

    // 拿到图片地址
    let srcStartIndex = layoutHtml.indexOf("src");
    let srcEndIndex = 0;
    if (srcStartIndex != -1) {
      srcEndIndex = layoutHtml.indexOf(">", srcStartIndex);
      contentDetail.contentImg = layoutHtml.slice(srcStartIndex + 5, srcEndIndex - 1);
    }
    // 拿到英文部分的html
    let enStartIndex = layoutHtml.indexOf("<p>", srcEndIndex);
    let enEndIndex = layoutHtml.indexOf("</p>", enStartIndex);
    let enHtml = layoutHtml.slice(enStartIndex, enEndIndex + 4);
    // 强调部分加上 class="keyword"
    contentDetail.contentEn = enHtml.replace(/<b>/, '<b class="keyword">');

    // 拿到中文部分的html
    let cnStartIndex = layoutHtml.indexOf("<p>", enEndIndex);
    contentDetail.contentCn = (cnStartIndex >= 0 ? layoutHtml.slice(cnStartIndex) : "");


    return contentDetail;
  }
}
