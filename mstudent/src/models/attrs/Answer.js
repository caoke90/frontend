/*
答案适配类，此处为一个桥接模式
*/
import Attr from './Attribute';
import ChoiceAnswer from './ChoiceAnswer';
import BlankAnswer from './BlankAnswer';
class Answer extends Attr{
	constructor(questionjson, index){
		super(questionjson, index);
		this.list = [];
		let cid = questionjson.content.subContents[index].subContentTypeId;
		let ans = null;
		this.question.answers.forEach((an, index)=>{
			switch(cid){
				case 1:
					ans = new ChoiceAnswer(an);
					this.list.push(ans);
				break;
				case 4:
					ans = new BlankAnswer(an);
					this.list.push(ans);
				break;
				case 5:

				break;
			}
		});
	}
}

export default Answer;