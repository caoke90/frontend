/**
 * @author junlin.yan
 * @date 2018/6/20
 * @description 填空题型
 */
import SubQuestion from './SubQuestion';

export default class BlankQuestion extends SubQuestion {
  constructor(question, index) {
    super(question, index);

    this.answers = [];
    if (this.$qs.answers) {
      this.$qs.answers.forEach((item, index) => {
        let answer = {
          answer: item.answer,
          subAnswers: item.subAnswers || []
        };
        this.answers.push(answer);
      });
    }
  }

  getAnswerString() {
    let ansArr = this.getAnswerList();
    return ansArr.join('; ');
  }

  getAnswerList() {
    let ansArr = [];
    // 多答案分割符，英语和语文用/，数学用或
    let subjectIdStr = String(this.subjectId);
    let subject_id = parseInt(subjectIdStr.substr(-1));

    let spliter = '';
    switch (subject_id) {
      case 1:
      case 3:
        spliter = ' / ';
        break;
      case 2:
        spliter = ' 或 ';
        break;
      default:
        spliter = ' 或 ';
        break;
    }

    this.answers.forEach((ans) => {
      let str = '';
      // 如果有subAnswers字段，则使用该字段作为答案
      if (ans.subAnswers && ans.subAnswers.length) {
        str += ans.subAnswers.join(spliter);
      } else {
        str = ans.answer;
      }
      ansArr.push(str);
    });
    return ansArr;
  }
}
