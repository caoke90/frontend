/**
 * @author junlin.yan
 * @date 2018/6/26
 * @description 口语基本题型
 */

import SubQuestion from './SubQuestion';

export default class OralBasicQuestion extends SubQuestion {
  constructor(question, index) {
    super(question, index);

    let oralDict = this.oralDict;
    if (oralDict) {
      switch (this.subContentTypeId) {
        case 14:
          // 跟读
          this.options = [];
          oralDict.options.forEach((op) => {
            this.options.push({
              text: op.text,
              voiceText: op.voiceText,
              cnText: op.cnText,
              seconds: op.seconds,
              listenUrl: op.listenUrl,
              listenSeconds: op.listenSeconds,
              dialogRole: op.dialogRole
            });
          });

          let wordFollowReadPic = [2030047, 2030048]; // 单词跟读、例句跟读
          let wordFollowReadPicNew = [203017003, 203017005]; // 新题型：  单词跟读、例句跟读
          // TODO 这些题型有图片，要正则解析出图片、英文、中文
          let wordFollowReadPicArray = [].concat(wordFollowReadPic, wordFollowReadPicNew);
          if (wordFollowReadPicArray.includes(this.questionType2Id)) {
            let contentDetail = this.parseContent();
            this.contentImg = contentDetail.contentImg;
            this.contentEn = contentDetail.contentEn;
            this.contentCn = contentDetail.contentCn;

            this.showContent = '<p><img src="' + this.contentImg + '"></p>' + this.contentEn + this.contentCn
          }
          break;
        case 23:
          // 情景对话
          this.scorePercentage = oralDict.scorePercentage;
          this.readySeconds = oralDict.readySeconds;
          this.sceneDescription = oralDict.sceneDescription;
          this.sceneName = oralDict.sceneName;

          this.options = [];
          oralDict.options.forEach((op) => {
            this.options.push({
              name: op.name,
              roleType: op.roleType,
              icon: op.icon,
              text: op.text,
              cnText: op.cnText,
              seconds: op.seconds,
              jsgf: op.jsgf,

              listenFileUrl: op.listenFile.url,
              listenFileSeconds: op.listenFile.seconds,
            });
          });
          break;
      }
    }
  }

  // 解析例句跟读，单词跟读等题型题目内容
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
