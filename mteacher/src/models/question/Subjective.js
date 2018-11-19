/**
 * @author junlin.yan
 * @date 2018/6/20
 * @description 主观题型
 */
import SubQuestion from './SubQuestion';

export default class SubjectiveQuestion extends SubQuestion {
  constructor(question, index) {
    super(question, index);

    this.answers = [];
    if (this.$qs.answers) {
      this.$qs.answers.forEach((item, index) => {
        let answer = item.answer;
        this.answers.push(answer);
      });
    }
  }

  getAnswerString() {
    let ansArr = [];

    this.answers.forEach((ans) => {
      let str = ans.answer || ans;
      ansArr.push(str);
    });
    return ansArr.join('<br>');
  }
}
