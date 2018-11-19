/**
 * @author junlin.yan
 * @date 2018/6/20
 * @description 判断题型
 */
import {charToCode} from '../../common/js/questionUtils';
import SubQuestion from './SubQuestion';

export default class JudgeQuestion extends SubQuestion {
  constructor(question, index) {
    super(question, index);
    this.answers = [];
    if (this.$qs.answers) {
      this.$qs.answers.forEach((item, index) => {
        let answer = item.answer;
        this.answers.push(answer);
      });
    }

    // {boolean} 判断题结果是否正确
    this.isCorrect = Boolean(this.answers[0] == 0);

    this.options = [
      {
        index: 0,
        showIndex: charToCode(65),
        option: '<span class="judge-right-option"></span>'
      },
      {
        index: 1,
        showIndex: charToCode(66),
        option: '<span class="judge-wrong-option"></span>'
      }
    ];
  }

  getAnswerString() {
    return this.isCorrect ? '✓' : '×';
  }
}
