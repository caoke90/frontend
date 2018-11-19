/**
 * 前端公共基础数据结构
 */

import Oral from './Oral';
import utils from '../../utils';
import AnswerResult from '../AnswerResult';

class Base {
	constructor(json){
        // 下划线转驼峰
        json = utils.parseCamelCase(json);
        // 格式化成前端标准题目格式
        let oralLocal = utils.getOralType(json.newContentSubtypeId);
        // 映射成前端标准题型ID
        this.oralId = oralLocal.oralId;
        // 映射成前端标准题型名称
        this.oralTxt = oralLocal.oralTxt;

        /*************** 配置信息 start; ***************/
        // 是否展示问题
        this.isShowQuestion = true;
        // 省市区
        this.region = json.region || {};
        // 科目id 【口语没有用到】
        this.subjectId = json.subjectId || "";
        // 总分数（平分到小问）
        this.totalScore = json.totalScore || 0;
        // 小题个数
        this.questionCount = json.questionCount || 0;
        // 口语模块的标题
        this.frontShowName = json.frontShowName || "";
        // 短文播放次数
        this.shortTextPlays = json.shortTextPlays || 0;
        // 总答题时间（平分到小问）
        this.totalAnswerTime = json.totalAnswerTime || 0;
        // 答题准备时间
        this.prepareTimeTotal = json.prepareTimeTotal || 0;
        // 一级题型ID
        this.newContentTypeId = json.newContentTypeId || "";
        // 审题准备时间（准备时间1）
        this.prepareTimeBefore = json.prepareTimeBefore || 0;
        // 作答说明
        this.chapInfos = utils.parseCamelCase(json.chapInfos);
        // 二级题型ID
        this.newContentSubtypeId = json.newContentSubtypeId || "";
        // 是否均分总答题时间
        this.isAverageTotalAnswerTime = Boolean(json.isAverageTotalAnswerTime);
        /*************** 配置信息 end; ***************/


        /*************** 自己添加的一些参数 学生端 start; ***************/
        // 学生答案
        this.meUserAnswer = json.meUserAnswer || [];
        // 题目的总分数
        this.meQuestionScore = json.meQuestionScore;
        // 题目在试卷中的下标
        this.meQuestionNumber = json.meQuestionNumber;
        // 录音失败允许重录次数 【暂时没有用】
        this.meOralRepeatCount = json.meOralRepeatCount || 1;
        // 题目的总分数(新增 总分数)
        this.meQuestionAllScore = json.meQuestionAllScore || 0;
        // 题目的小题数量(新增 总小题数量)
        this.meSubQuestionCount = json.meSubQuestionCount || 0;
        // 小题题号列表
        this.meSubQuestionNumberList = json.meSubQuestionNumberList || [];
        // 用户的得分
        this.meSubUserScore = json.meSubUserScore && json.meSubUserScore[0];
        // 该题目分数
        this.meSubQuestionScore = json.meSubQuestionScore && json.meSubQuestionScore[0];
        /*************** 自己添加的一些参数 学生端 end; ***************/


        /*************** 题目信息 start; ***************/
        // 题目ID
		this.id = json.id;
        // 1：复合题，0：非复合题
        this.complex = json.complex;
        // 题目中的作答说明
        this.description = utils.trim(json.description);
        // 题目作答说明 音频url
        this.descriptionFileUrl = json.descriptionFile ? json.descriptionFile.url : '';
        // 题目作答说明 音频时间
        this.descriptionFileSeconds = json.descriptionFile ? json.descriptionFile.seconds : 0;
        // 如果数据有音频url，单没有时间，前端做下简单计算
        if (this.descriptionFileUrl && !this.descriptionFileSeconds) {
            this.descriptionFileSeconds = utils.calculateTime(this.descriptionFileUrl);
        }
        // 大题题干
        this.content = utils.underline(json.content.content);
        // 大题题干听力原文
        this.contentDesc = utils.underline(json.content.contentDesc);
        // 大题题干听力音频url【listenUrlSingle是后来加的，因为之前音频中出现重复多遍的情况】
        this.listenUrl = json.listenUrlSingle ? json.listenUrlSingle : json.listenUrl;
        // 大题题干听力音频时间【同上】
        this.listenSeconds = json.listenSecondsSingle ? json.listenSecondsSingle : json.listenSeconds;
        // 如果数据有音频url，单没有时间，前端做下简单计算
        if (this.listenUrl && !this.listenSeconds) {
            this.listenSeconds = utils.calculateTime(this.listenUrl);
        }
        // 引擎类型
        this.voiceEngineId = json.voiceEngineId || 'normal';
        // 这个不知道是什么
        this.ratio = json.ratio || 1;
        // 学生作答结果
        this.answerResult = new AnswerResult(json.content.subContents.length, this);
        // 小题数据
        this.subContents = [];
        // 格式化小题数据
        json.content.subContents.forEach((sub) => {
            sub = utils.parseCamelCase(sub);
            // 单条小题题目数据
            let subContent = new Oral(sub);
            //
            subContent.meSubQuestionNumber = sub.meSubQuestionNumber;
            //
            subContent.meSubContentIndex = sub.meSubContentIndex;
            // 每个小问的问题播放次数 0代表不播放
            subContent.questionPlays = sub.questionPlays || 0;
            // 每个小问的准备答题时间
            subContent.prepareTime = sub.prepareTime || 0;
            // 每个小问的空数（为一个数组，代表小题空数为 2 或 3）
            subContent.blankCount = sub.blankCount || [];
            // 每个小问的选项数
            subContent.optionCount = sub.optionCount || 0;
            // 每个小问的答题时间
            subContent.answerTime = sub.answerTime || 0;
            // 每个小问的分数
            subContent.qsScore = sub.qsScore || 0;

            this.subContents.push(subContent);
        });
        /*************** 题目信息 end; ***************/

	}
}

export default Base;
