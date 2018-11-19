import Attr from './Attribute';

class Content extends Attr{
	constructor(questionjson, index){
		super(questionjson, index);
		this.value = '';
		if(questionjson.content.subContents[index].pictureUrl){
			this.value += `<div><img src="${questionjson.content.subContents[index].pictureUrl}" /></div>`;
		}
		this.value += this.preParse(questionjson.content.subContents[index].content);
	}

	//对提供内容进行过滤
	preParse(cont){
		//latex标签
		let div = document.createElement('div');
		//let dom = document.createRange().createContextualFragment(cont);
		/*let imgs = dom.querySelectorAll('img');
		imgs.forEach((img)=>{
			if(img.hasAttribute('latex')){
				let latex = img.getAttribute('latex');
				let newNode = document.createElement('span');
				newNode.innerHTML = latex;
				dom.replaceChild(newNode, img);
			}
		});*/
		div.innerHTML = cont;
		let tables = div.querySelectorAll('table');
		for(let i=0,len=tables.length; i<len; i++){
			let t = tables[i];
			t.style.width = '';
		}

		return div.innerHTML;

	}

	//后转化，题干显示出来后需要进行的转化
	postParse(cont){
		//给表格多包一层div，用于滚动
		let tables = cont.querySelectorAll('table');
		if(tables && tables.length){
			for(let i=0; i<tables.length; i++){
				let tb = tables[i];
				let wrapper = document.createElement('div');
				wrapper.className = 'v-table-wrap';
				let tbParent = tb.parentNode;
				tbParent.insertBefore(wrapper, tb);
				wrapper.appendChild(tb);
			}
		}


		//图上填空的容器
		let imgParent = cont.querySelector('#img_parent');
		if(imgParent){
			let img = imgParent.querySelector('img');
			if(img){
				img.onload = function(){
					imgParent.setAttribute('data-loaded', 1);//标记图片已经加载完毕了
					let originW = img.getAttribute('width');
					let currentW = img.getBoundingClientRect().width;
					let currentH = img.getBoundingClientRect().height;
					let zoom = 1;
					if(currentW>0 && originW>0){
						zoom = currentW/originW;
						img.style.height = 'auto';
						imgParent.style.height = currentH + 'px';
						let boxs = imgParent.querySelectorAll('.add-box');
						for(let i =0; i<boxs.length; i++){
							let box = boxs[i];
							box.style.width = parseFloat(box.style.width)*zoom + 'px';
							box.style.height = parseFloat(box.style.height)*zoom + 'px';
							box.style.left = parseFloat(box.style.left)*zoom + 'px';
							box.style.top = parseFloat(box.style.top)*zoom + 'px';
						}
					}
				}
			}
			
			
		}
	}

	toString(){
		return this.value;
	}
}

export default Content;