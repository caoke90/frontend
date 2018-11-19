/**
 * @author junlin.yan
 * @date 2018/6/20
 * @description 判断题型
 */
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
  }
}
