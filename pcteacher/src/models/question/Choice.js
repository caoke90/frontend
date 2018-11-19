/**
 * @author junlin.yan
 * @date 2018/6/20
 * @description 选择题型
 */
import SubQuestion from './SubQuestion';
import {ChoiceOption} from './Base';
import {charToCode} from '../../common/js/questionUtils';

export default class ChoiceQuestion extends SubQuestion {
  constructor(question, index) {
    super(question, index);
    // {boolean} 是否多选
    this.isMulti = this.subContentTypeId == 2 || this.subContentTypeId == 3;

    this.answers = [];
    this.options = [];

    if (this.$qs.answers) {
      this.$qs.answers.forEach((item, index) => {
        let answer = item.answer;
        this.answers.push(answer);
      });
    }


    if (this.$qs.options) {
      this.$qs.options.forEach((opt, optIndex) => {
        let option = new ChoiceOption(opt, this.$qs, optIndex);
        let index = String(optIndex);
        let isCorrectAnswer = this.answers.includes(index);
        option.isCorrectAnswer = isCorrectAnswer;
        this.options.push(option);
      });
    }
  }

  getAnswerString() {
    let ansArr = [];
    ansArr = this.answers.map(function (ans) {
      return charToCode(parseInt(ans) + 65);
    });
    return ansArr.join(' ');
  }
}
