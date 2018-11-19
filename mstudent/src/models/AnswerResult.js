/*
作答结果类，用于存储用户答案，答题结果
挂在大题上
外部调用setUserAnswer来保存用户答案
*/
class AnswerResult{
	constructor(subQuestionNum, qobj){
		this.userAnswer = []; //用户答案
		this.fullScore = 0; //总分
		this.score = 0; //得分
		this.correct = false; //是否正确
		this.subCorrect = []; //标记单独的正确情况
		for(let i=0;i<subQuestionNum;i++){

			let userA = qobj.meUserAnswer[i];
            this.userAnswer.push(userA ? userA : [""]);
		}
		this.qobj = qobj
	}

	//根据传入的数据进行初始化， 参数：json：用户答案，notJudge: 不判题。用于需要继续作答的场景
	init(json, notJudge){
		this.userAnswer = json.userAnswer || [];
		if(!notJudge){
			if(typeof json.correct === 'undefined'){
				this.qobj.getAnswerResult('local');
			}
			else{
				this.correct = json.correct;
				this.subCorrect = json.subCorrect;
			}
		}
	}

	/*设置用户答案
		参数含义：
		index：子题的序号
		ans：答案数组
		obj: 当前试题对象
	*/
	setUserAnswer(index, ans, qobj){
		if(!this.userAnswer[index]){
			this.userAnswer[index] = [];
		}
		this.userAnswer.splice(index, 1, ans);
		return this.qobj.validateAnswer();
	}
}

export default AnswerResult;