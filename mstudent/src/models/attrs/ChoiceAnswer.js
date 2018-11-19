/*
选择题的答案
*/
import Attr from './Attribute';
class ChoiceAnswer extends Attr{
	constructor(answerjson, questionjson, index){
		super(questionjson, index);
		this.value = answerjson.answer;
	}

	
}

export default ChoiceAnswer;