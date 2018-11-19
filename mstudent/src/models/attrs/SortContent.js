import Attr from './Attribute';

class SortContent extends Attr{
	constructor(questionjson, index){
		super(questionjson, index);
		this.value = '<div>' + questionjson.content.subContents[index].content + '</div>';

		//组装题干HTML
		let options = questionjson.content.subContents[index].options;
		let tempArray = [];
		options.forEach((opt, index)=>{
			tempArray.push(this.buildBlank());
		});
		this.value += tempArray.join(this.buildArrow());
	}

	buildBlank(){
		return '__$$__';
	}

	buildArrow(){
		return '<i class="arrow-right"></i>';
	}

	//对提供内容进行过滤
	preParse(cont){
	

	}

	//后转化，题干显示出来后需要进行的转化
	postParse(cont){

		
	}

	toString(){
		return this.value;
	}
}

export default SortContent;