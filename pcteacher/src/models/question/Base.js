/**
 * @author junlin.yan
 * @date 2018/6/20
 * @description 基础数据model
 */

import {charToCode} from '../../common/js/questionUtils';

/**
 * 音频信息
 */
export class ListenFile {
  constructor(properties) {
    this.fileId = properties.fileId || '';
    this.url = properties.url || '';
    this.filename = properties.filename || '';
    this.seconds = properties.seconds || 0;
  }
}

/**
 * 答案
 */
export class Answer {
  constructor(properties) {
    // 答案文本
    this.answer = properties.answer || '';
    if (properties.listenFile) {
      // 答案音频
      this.listenFile = new ListenFile(properties.listenFile);
    }
    if (properties.subAnswers) {
      // 多答案使用
      this.subAnswers = properties.subAnswers;
    }
  }
}

/**
 * 新版知识点
 */
export class KnowledgePointsNew {
  constructor(properties) {
    this.id = properties.id;
    this.tagId = properties.tagId;
    this.main = properties.main;
    this.featureIds = properties.featureIds || [];
    this.name = properties.name || ''
  }
}

/**
 * 选项
 */
export class ChoiceOption {
  constructor(properties, subQuestion, index) {
    this.index = index;
    this.showIndex = charToCode(65 + this.index);
    // {string}  小题选项, 选项值，一段富文本字符串，可能包含图片
    this.option = '';
    // {ListenFile} 选项音频，包含file_id、url、filename、seconds四个字段
    this.file = null;
    // {boolean} 是否是正确答案
    this.isCorrectAnswer = false;

    // {boolean} 是否被选中
    this.checked = false;

    this.init(properties);
  }

  init(properties) {
    if (typeof properties == 'string') {
      this.option = properties;
    } else {
      this.option = properties.option;
    }
    if (properties.file) {
      this.file = new ListenFile(properties.file);
    }
  }
}

/**
 * 跟读oralDict，基本题型14
 */
export class OralDictFollowReadBasic {
  constructor(properties) {
    this.options = [];
    if (properties.options) {
      properties.options.forEach((op, opIndex) => {
        let option = {
          text: op.text || '',  // 显示内容
          voiceText: op.voiceText || '',  // voice_text
          cnText: op.cnText | '',  // 译文
          seconds: op.seconds || 0, // 作答时间， 单位秒
          listenUrl: op.listenUrl, // 听力题资源路径
          listenSeconds: op.listenSeconds, // 听力题资源时长
          dialogRole: op.dialogRole,  // 跟读的角色。其中（若是阿拉伯数字，表示是该句为第几个段落。若是'Title', 'Subtitle', 'Narrator', 'Greeting', 'Closing', 'Signature', 'Content'，表示隐藏的说明。其余值处理为角色。
        };
        this.options.push(option);
      });
    }

    // {string} 图片地址
    this.picUrl = properties.picUrl;
    // {string} 图片名称
    this.picName = properties.picName;
  }
}

/**
 * 情景对话oralDict，基本题型23
 */
export class OralDictDialoguesBasic {
  constructor(properties) {
    // {number} 分数百分比
    this.scorePercentage = properties.scorePercentage;
    // {string} 准备答题时长
    this.readySeconds = properties.readySeconds;
    // {string} 情景描述
    this.sceneDescription = properties.sceneDescription;
    // {string} 情景名称
    this.sceneName = properties.sceneName;
    // {string} 图片地址
    this.picUrl = properties.picUrl;
    // {string} 图片名称
    this.picName = properties.picName;

    this.options = [];
    if (properties.options) {
      properties.options.forEach((op, opIndex) => {
        let listenFile = null;
        if (op.listenFile) {
          listenFile = new ListenFile(op.listenFile);
        }

        let option = {
          name: op.name || '',  // 角色名称
          roleType: op.roleType, // 角色序号1/2
          icon: op.icon || '', // 角色头像
          text: op.text || '',  // 显示内容
          cnText: op.cnText | '',  // 译文
          voiceTextsNew: op.voiceTextsNew || [],  // 音频文本(数组)（主观回答题目，录入所有可能的音频文本用于生成jsgf）
          seconds: op.seconds || 0, // 作答时间， 单位秒
          listenFile: listenFile, // 音频
          jsgf: op.jsgf || ''  // 语音引擎打分字符串
        };
        this.options.push(option);
      });
    }
  }
}

/**
 * 口语主观题oralDict，基本题型18
 */
export class OralDictSubjective {
  constructor(properties) {
    // {string} 开始录音提示音，可以为空
    this.beginListenUrl = properties.beginListenUrl;
    // {string} 结束录音提示音，可以为空
    this.endListenUrl = properties.endListenUrl;
    // {number} 分数百分比
    this.scorePercentage = properties.scorePercentage;
    // {string} 准备答题时长
    this.readySeconds = properties.readySeconds;
    // {ListrnFile} 音频
    this.listenFile = null;
    if (properties.listenFile) {
      this.listenFile = new ListenFile(properties.listenFile);
    }
    // {string}  小题题干听力原文
    this.contentDesc = properties.contentDesc || '';
    // {number} 作答时间，单位秒
    this.seconds = properties.seconds;
    // {string} 变量, string
    this.variables = properties.variables || [];
    // {string} 句式, string
    this.sentencePatterns = properties.sentencePatterns || [];
    // {stirng[]} 关键字
    this.keywords = properties.keywords || [];
    // 参考答案
    this.answers = [];
    if (properties.answers) {
      properties.answers.forEach((ans) => {
        let answer = new Answer(ans);
        this.answers.push(answer);
      });
    }
    // {string} 语音引擎打分字符串
    this.jsgf = properties.jsgf || '';
  }
}

/**
 * （短文、单词、句子）朗读oralDict，基本题型19
 */
export class OralDictRead {
  constructor(properties) {
    // {string} 开始录音提示音，可以为空
    this.beginListenUrl = properties.beginListenUrl;
    // {string} 结束录音提示音，可以为空
    this.endListenUrl = properties.endListenUrl;
    // {number} 分数百分比
    this.scorePercentage = properties.scorePercentage;
    // {string} 准备答题时长
    this.readySeconds = properties.readySeconds;
    // voice text
    this.voiceTextsNew = properties.voiceTextsNew || [];
    // {ListrnFile} 音频
    this.listenFile = null;
    if (properties.listenFile) {
      this.listenFile = new ListenFile(properties.listenFile);
    }
    // {string}  小题题干听力原文
    this.contentDesc = properties.contentDesc || '';
    // {number} 作答时间，单位秒
    this.seconds = properties.seconds;
    // {string} 语音引擎打分字符串
    this.jsgf = properties.jsgf || '';
  }
}

/**
 * 角色朗读（新）oralDict，基本题型20
 */
export class OralDictRoleRead {
  constructor(properties) {
    // {string} 开始录音提示音，可以为空
    this.beginListenUrl = properties.beginListenUrl;
    // {string} 结束录音提示音，可以为空
    this.endListenUrl = properties.endListenUrl;
    // {number} 分数百分比
    this.scorePercentage = properties.scorePercentage;
    // {string} 准备答题时长
    this.readySeconds = properties.readySeconds;

    this.options = [];
    if (properties.options) {
      properties.options.forEach((op, opIndex) => {
        let listenFile = null;
        if (op.listenFile) {
          listenFile = new ListenFile(op.listenFile);
        }
        let option = {
          name: op.name || '',  // 角色名称
          text: op.text || '',  // 显示内容
          voiceTextsNew: op.voiceTextsNew || [],  // 音频文本(数组)（主观回答题目，录入所有可能的音频文本用于生成jsgf）
          seconds: op.seconds || 0, // 作答时间， 单位秒
          roleType: op.roleType,  // 角色类型：1 作答角色，2 非作答角色
          listenFile: listenFile, // 音频
          jsgf: op.jsgf || ''  // 语音引擎打分字符串
        };
        this.options.push(option);
      });
    }
  }
}

/**
 * 跟读（新）oralDict，基本题型21
 */
export class OralDictFollowRead {
  constructor(properties) {
    // {string} 开始录音提示音，可以为空
    this.beginListenUrl = properties.beginListenUrl;
    // {string} 结束录音提示音，可以为空
    this.endListenUrl = properties.endListenUrl;
    // {number} 分数百分比
    this.scorePercentage = properties.scorePercentage;
    // {string} 准备答题时长
    this.readySeconds = properties.readySeconds;

    this.options = [];
    if (properties.options) {
      properties.options.forEach((op, opIndex) => {
        let listenFile = null;
        if (op.listenFile) {
          listenFile = new ListenFile(op.listenFile);
        }

        let option = {
          text: op.text || '',  // 显示内容
          voiceTextsNew: op.voiceTextsNew || [],  // 音频文本(数组)（主观回答题目，录入所有可能的音频文本用于生成jsgf）
          seconds: op.seconds || 0, // 作答时间， 单位秒
          listenFile: listenFile, // 音频
          jsgf: op.jsgf || ''  // 语音引擎打分字符串
        };
        this.options.push(option);
      });
    }
  }
}
