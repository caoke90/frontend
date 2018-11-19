/*
填空题的答案
*/
import Attr from './Attribute';
class BlankAnswer extends Attr{
	constructor(answerjson, questionjson, index){
		super(questionjson, index);
		this.value = answerjson.answer;
		this.subAnswers = answerjson.subAnswers || []; //用于多答案
	}

	
}

export default BlankAnswer;