/*
选择题的选项
*/
import Attr from './Attribute';
class ChoiceOption extends Attr{
	constructor(optionjson, questionjson, index){
		super(questionjson, index);
		this.file = optionjson.file;
		this.name = optionjson.option;
		this.checked = false;			
	}

	
}

export default ChoiceOption;