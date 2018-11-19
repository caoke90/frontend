/*
 归类题的答案
 */
import Attr from './Attribute';
class ClassifAnswer extends Attr{
    constructor(answerjson, questionjson, index){
        super(questionjson, index);
        this.value = answerjson.answer;
        this.classification = answerjson.classification;
    }
}

export default ClassifAnswer;