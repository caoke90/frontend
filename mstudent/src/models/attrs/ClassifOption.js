/*
归类题的选项
*/
import Attr from './Attribute';
class ClassifOption extends Attr{
	constructor(optionjson, questionjson, index){
		super(questionjson, index);
		this.option = optionjson.option;
		this.correct = false;
	}

	
}

export default ClassifOption;