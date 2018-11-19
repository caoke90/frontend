/**
	subq : 需替换的内容
	toBeReplace 需替换字符
	replaceWith ：替换文本
	replaceAdd	：增加内容
	type: math 数学题
*/
import {mathJax} from './mathJax';

const replaceWithArray =  [
	'<span class="v-fill-wrap"><input type="text" class="v-fill-in">',
	'<span class="v-fill-wrap"><input type="text" class="v-fill-in mathinput" disabled="disabled">',
	'<span class="v-fill-wrap"><input type="text" class="v-fill-in" readonly="readonly">',
	'<span class="v-fill-wrap word-spell"><input type="text" class="sbfont v-fill-in" readonly="readonly"><span class="word-spell-underline"></span>',
	'<span class="v-fill-wrap"><input type="text" class="v-fill-in englishinput" disabled="disabled">'
];


export function blankReplace(content, subq, toBeReplace, subjectId) {
	let isMath = [102, 202, 302].includes(subjectId);
	let isChinese = [101, 201, 301].includes(subjectId);
	let isEnglish = [103, 203, 303].includes(subjectId);
	let isChoiceBlank, isWordSpell;
	isWordSpell = subq.contentType2Id==1032006 || subq.contentType2Id==1032007;
	isChoiceBlank = (subq.subContentTypeId == 10 || subq.subContentTypeId == 9) && !isWordSpell;

	//选词填空、排序是同样的替换规则
	let isBlank = subq.subContentTypeId == 4;
	let replaceWith;
	if(isMath){
		if(isBlank){
			replaceWith = replaceWithArray[1];
		}
		else{
			if(isChoiceBlank){
				replaceWith = replaceWithArray[2];
			}
		}
	}
	else if(isChinese){
		if(isChoiceBlank){
			replaceWith = replaceWithArray[2];
		}
		else{
			replaceWith = replaceWithArray[0];
		}
	}
	else if(isEnglish){
		if(isChoiceBlank){
			replaceWith = replaceWithArray[2];
		}
		else if(isWordSpell){
			replaceWith = replaceWithArray[3];
		}
		else{
			replaceWith = replaceWithArray[4];
		}
	}
	else{
		replaceWith = replaceWithArray[0];
	}

	let answers = subq.answers;

	let i = 0, 
		positon = -1,
		resultStr = "";  // 处理结果

	// 过程中的临时变量 
	let tmpStr = "",
	ans = 0;  // 答案

	let getLength = function(str){
		let size = 0;
		for(let j=0, len=str.length; j<len; j++){
			let charCode = str.charCodeAt(j);
			size += charCode > 0xff ? 2 : 1;
		}
		return size;
	}

	if(isMath || isChoiceBlank){
		content = content.replace(/\<p[^>]*\>/g,'<div>');
		content = content.replace(/\<\/p\>/g,'</div>');
	}

	positon = content.indexOf(toBeReplace);
	let oldContent = content;
	while(positon>-1) {
		let tempReplace = replaceWith;
		if(answers.length && answers[i]){  // 获取答案长度
			ans = getLength(answers[i].value);
		}
		if(isChoiceBlank){
			//单词类型的空，安装字符算长度。其他类型的，全部为2
			if(subq.optionTypeMark==0){
				ans = getLength(subq.options[answers[i].value].name);
			}
			else{
				ans = 2;
			}
			
			let str1 = " size=" + (ans+2);
			let indexStr =  " data-index=" + i;
			tempReplace = tempReplace.replace(/>$/,function(){
				return  str1 +'  ' +indexStr  + ' ></span>';
			});

			//不是图上填空的情况，才加序号
			if(oldContent.indexOf('img_parent')==-1){
				tempReplace = '<span class="v-blank-num">'+ (i+1) +'</span>' +  tempReplace;
			}
			
		}else{
			tmpStr = ` size=${ans+2} data-index=${i}`;
			tempReplace = tempReplace.replace(/>$/,function(){
				return `${tmpStr} ></span>`;
			});
		}

		resultStr += content.substring(0, positon) + tempReplace;
		content = content.substring(positon + toBeReplace.length);
		positon = content.indexOf(toBeReplace);
		i++; // 
	}
	resultStr += content;
	return  resultStr; 
}

/*
处理填空题的公式
replaceFrac: 是否将分式替换成一个空（口算需要）
*/
export function dealLatex(subq, replaceFrac){

	let result = ''
	let content = subq.content.value;
	let answers = subq.answers;
	let isMath = [102, 202, 302].includes(subq.subjectId);

	let ansLength = "";  // 答案
	let answerIndex = 0;
	let fracInputCount = -1; //用于给合并分式的输入框计数
	let blankcount = 0; //当前合并的空对应的答案起始序号
	result = result.replace(/<img(.*?)height="[^\"]+"([^>]*)>/g, '<img$1height=""$2>');//去掉图片的height属性
	result = content.replace(/(?:<img[\w\s\/='":.-]*?latex="([^\"]+)"[^>]*>)/g, function(word, latex){
		if(replaceFrac){
			//有分式，并且空的个数大于1
			let fracMatch = latex.match(/frac/g);
			let fboxMatch = latex.match(/fbox/g);
			if(fracMatch && fracMatch.length>0 && fboxMatch && fboxMatch.length>1){
				fracInputCount++;
				subq.fracMerged = subq.fracMerged||{}; //给题目加个标记字段
				subq.fracMerged[fracInputCount] = fboxMatch.length; //标记该空合并了几个答案
				let result = `<span class="v-fill-wrap frac-wrap"><input type="text" class="v-fill-in mathinput fracinput" size="4" data-index="${fracInputCount}" disabled="disabled" data-blanknum="${fboxMatch.length}" data-blankcount="${blankcount}"></span>`;
				
				blankcount += fboxMatch.length;

				return result;
			}
		}
		
		return ('$'+latex+'$').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	});  // 提取latex内容，删除img src
	let addName = '';

	//旧代码中没找到这部分逻辑，先注掉
	/*if(/\\frac/.test(result)){ // 是否有分式
		addName = "frac";
	}*/

	//用于标记mathjax生成的空的序号
	let blankIndex = -1;
	result = result.replace(/\\fbox\s?\{\}/g,(item, index, a)=>{
		blankIndex++;
		ansLength = (answers[answerIndex].value.length || 1)+2;
		answerIndex++;
		let mathClass = isMath ? 'mathinput' : ''; //有可能出现422这种学科，所以这里还是要判断一下学科的
		return `\\FormInput[${ansLength}][v-fill-in ${mathClass}][]{${blankIndex}}`
	});
	return result;
}

//转化LaTeX公式为dom标签
export function parseFormula(componnet, callback){
	let f = (container)=>{
		if(container){
			if(container.nodeType!=8){
				//container.style.visibility = 'hidden';
				mathJax(container, ()=>{
					//container.style.visibility = 'visible';
					typeof callback==='function' && callback();
				});
			}
		}
	}

	if(componnet.$nextTick){
		componnet.$nextTick(()=>{
			let container = componnet.$el;
			f(container)
		});
	}
	else{
		setTimeout(function(){
			f(componnet);
		});
	}
	
	
}

//将分数数据格式化为html,  分数格式为：3|5/6  (3又6分之5)
export function formatFrac(value, isCorrect){
	let resultHTML;
	if(value === '?'){
		resultHTML = value;
	}
	else if(value === ''){
		resultHTML = '';
	}
	else{
		let result = value.split(/[|/]/);
		let d = result[0] || '?'; //整数部分
		let z = result[1] || '?'; //分子部分
		let m = result[2] || '?'; //分母部分
		resultHTML = `<span class="frac-html-wrapper"><span class="frac-html-top">${z}</span><span class="frac-html-bottom">${m}</span></span>`;
		if(d!=='0'){
			resultHTML = `<span class="frac-html-d">${d}</span>` + resultHTML;
		}
	}

	let correctClass = '';
	if(typeof isCorrect!=='undefined'){
		correctClass = isCorrect ? 'correct' : 'error';
	}
	
	return '<span class="frac-html '+correctClass+'">'+resultHTML+'</span>';
}  