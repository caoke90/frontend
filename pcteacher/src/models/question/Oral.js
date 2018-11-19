/**
 * @author junlin.yan
 * @date 2018/6/21
 * @description 口语子题型
 */

import SubQuestion from './SubQuestion';

export default class OralQuestion extends SubQuestion {
  constructor(question, index) {
    super(question, index);

    let oralDict = this.oralDict;
    if (oralDict) {
      this.beginListenUrl = oralDict.beginListenUrl; // 开始录音音频
      this.endListenUrl = oralDict.endListenUrl; // 结束录音音频
      this.scorePercentage = oralDict.scorePercentage;  // 分数百分比
      this.readySeconds = oralDict.readySeconds; // 准备答题时间
      this.seconds = oralDict.seconds; // 作答时长(录音时间)，单位秒

      switch (this.subContentTypeId) {
        case 18:
          // 口语主观题
          this.listenFileUrl = oralDict.listenFile.url; // 题干音频
          this.listenFileSeconds = oralDict.listenFile.seconds; // 音频时长
          this.contentDesc = oralDict.contentDesc;  // 题干听力原文
          this.variables = oralDict.variables;  // 变量，string
          this.sentencePatterns = oralDict.sentencePatterns; //句式，string
          this.keywords = oralDict.keywords; //关键词，string
          this.jsgf = oralDict.jsgf; // 语言引擎打分字符串
          this.answers = oralDict.answers.slice(0, 1); //参考答案
          break;
        case 19:
          // （短文、单词、句子）朗读
          this.listenFileUrl = oralDict.listenFile.url; //题干音频
          this.listenFileSeconds = oralDict.listenFile.seconds; // 音频时长
          this.contentDesc = oralDict.contentDesc; //题干听力原文
          this.voiceTexts = oralDict.voiceTextsNew[0]; //音频文本
          this.jsgf = oralDict.jsgf; //语言引擎打分字符串
          break;
        case 20:
          // 角色朗读（新）
          this.options = [];
          oralDict.options.forEach((op) => {
            this.options.push({
              name: op.name,
              text: op.text,
              voiceTexts: op.voiceTextsNew[0],
              seconds: op.seconds,
              roleType: op.roleType || '',
              listenFileUrl: op.listenFile.url,
              jsgf: op.jsgf
            });
          });
          break;
        case 21:
          // 跟读（新）
          this.options = [];
          oralDict.options.forEach((op) => {
            this.options.push({
              text: op.text,
              voiceTexts: op.voiceTextsNew[0],
              seconds: op.seconds,
              listenFileUrl: op.listenFile.url,
              listenFileSeconds: op.listenFile.seconds,
              jsgf: op.jsgf
            });
          });
          break;
      }
    }


    // 角色朗读答案
    if (this.subContentTypeId == 20 && this.answers.length < 1) {
      this.answers = [];
      if (this.options && this.options.length > 0) {
        this.options.forEach((opt) => {
          if (opt.voiceTexts && opt.voiceTexts.length > 0) {
            let ans = opt.voiceTexts.join(' / ');
            this.answers.push(ans);
          }
        });
      }
    }
  }

  getAnswerString() {
    let ansArr = [];

    this.answers.forEach((ans) => {
      let str = ans.answer || ans;
      ansArr.push(str);
    });
    return ansArr.join('');
  }
}
