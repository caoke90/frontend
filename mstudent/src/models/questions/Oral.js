/*
* @Author: bin.liu
* @Date:   2018-11-14 20:22:57
* @Last Modified by:   bin.liu
* @model: 口语小题题干数据
*/

class Oral {
    constructor(json) {
        // 小题原型
        let oralDict = json.oralDict;
        if(oralDict){
            // 开始录音音频
            this.beginListenUrl = oralDict.beginListenUrl;
            // 结束录音音频
            this.endListenUrl = oralDict.endListenUrl;
            // 准备答题时间
            this.readySeconds = oralDict.readySeconds;
            // 录音时间
            this.recordSeconds = oralDict.seconds;

            switch(json.subContentTypeId){
                /******** 情景反应、回答问题、听选信息、信息转述、询问信息、情景问答、口头表达 ********/
                case 18:
                    // 语言引擎打分字符串
                    this.jsgf = oralDict.jsgf;
                    // 参考答案
                    this.answers = oralDict.answers;
                    // 关键词
                    this.keywords = oralDict.keywords;
                    // 口语主观题
                    this.variables = oralDict.variables;
                    // 题干听力原文
                    this.contentDesc = oralDict.contentDesc;
                    // 句式
                    this.sentencePatterns = oralDict.sentencePatterns;
                    // 题干音频
                    this.listenFileUrl = oralDict.listenFile.urlSingle?oralDict.listenFile.urlSingle:oralDict.listenFile.url;
                    // 题干音频
                    this.listenSeconds = oralDict.listenFile.secondsSingle?oralDict.listenFile.secondsSingle:oralDict.listenFile.seconds;
                    break;

                /******** 短文朗读、读单词、读句子 ********/
                case 19:
                    // 语言引擎打分字符串
                    this.jsgf = oralDict.jsgf;
                    // 题干听力原文
                    this.contentDesc = oralDict.contentDesc;
                    // 音频文本
                    this.voiceTexts = oralDict.voiceTextsNew && oralDict.voiceTextsNew[0] && oralDict.voiceTextsNew[0][0];
                    // 题干音频
                    this.listenFileUrl = oralDict.listenFile.urlSingle?oralDict.listenFile.urlSingle:oralDict.listenFile.url;
                    // 题干音频
                    this.listenSeconds = oralDict.listenFile.secondsSingle?oralDict.listenFile.secondsSingle:oralDict.listenFile.seconds;
                    break;

                /******** 情景对话 ********/
                case 20:
                    // 角色数据数组
                    this.options = [];
                    // 平均每小题的答题时间
                    let time = 0;
                    // 如果有总时长 则平分到每小问 1录音者 2朗读者
                    if(this.totalAnswerTime){
                        time = parseInt(totalAnswerTime/oralDict.options.filter((opt)=>opt.roleType==1).length)
                    }
                    // 角色
                    oralDict.options.forEach((op)=>{
                        // 角色数据存放
                        this.options.push({
                            // 角色名字
                            name: op.name,
                            // 文本信息
                            text: op.text,
                            // 语言引擎打分字符串
                            jsgf: op.jsgf,
                            // 角色 1录音者  2朗读者
                            roleType: op.roleType || '',
                            // 录音时长
                            recordSeconds: time?time:op.seconds,
                            // 角色2文本
                            voiceTexts: op.voiceTextsNew && op.voiceTextsNew[0],
                            // 音频播放时长 角色2需要播放音频
                            listenFileUrl: op.listenFile.urlSingle?op.listenFile.urlSingle:op.listenFile.url,
                            // 音频播放时长 角色2需要播放音频
                            listenSeconds: op.listenFile.secondsSingle?op.listenFile.secondsSingle:op.listenFile.seconds
                        });
                    });
                    break;

                /******** 模仿朗读 ********/
                case 21:
                    let opt = oralDict.options[0] || { listenFile: {} };
                    // 语言引擎打分字符串
                    this.jsgf = opt.jsgf || '';
                    // 题干文本
                    this.content = opt.text || '';
                    // 录音时间【如果没有默认给个20s吧】
                    this.recordSeconds = opt.seconds || 20;
                    // 短文音频url
                    this.listenFileUrl = opt.listenFile.urlSingle?opt.listenFile.urlSingle:opt.listenFile.url;
                    // 短文音频播放时长
                    this.listenSeconds = opt.listenFile.secondsSingle?opt.listenFile.secondsSingle:opt.listenFile.seconds;
                    break;

                /******** 默认处理 ********/
                default:
                    // TODO
            }

        }
    }
}

export default Oral;
