/**
 * @author junlin.yan
 * @date 2018/6/21
 * @description 与题目相关方法
 */


const difficultyList = ['未知', '较易', '较易', '中等', '困难', '困难'];

/**
 * 获取题目难易程度
 * @param difficultyInt
 */
export function getDifficultyStr(difficultyInt) {
  return difficultyList[difficultyInt] || '未知';
}

/**
 * 根据subContentTypeId获取题型组件
 * @param subContentTypeId
 * @returns {*|string}
 */
export function id2name(subContentTypeId) {
  let map = {
    // 单选小题
    '1': 'choice',
    // 多选小题
    '2': 'choice',
    // 不定项选择小题
    '3': 'choice',
    // 填空小题
    '4': 'blank',
    // 判断小题
    '5': 'judge',
    // 主观小题
    '6': 'subjective',
    // 排序小题
    '9': 'sortBase',
    // 选词填空
    '10': 'choiceBlank',
    // 跟读
    '14': 'oralBasicFollowRead',
    // 口语主观题
    '18': 'oralSubjective',
    // （短文、单词、句子）朗读
    '19': 'oralRead',
    // 角色朗读（新）
    '20': 'oralRoleRead',
    // 跟读（新）
    '21': 'oralFollowRead',
    // 情景对话
    '23': 'oralBasicDialogues'
  };
  let result = map[subContentTypeId] || '';
  return result;
}

/**
 * 将数字转为ascii码字符
 * @param num
 * @returns {string}
 */
export function charToCode(num) {
  return String.fromCharCode(num);
}

/**
 * 替换字符串中__为题目序号
 * @param {string} content  内容
 * @param {number} indexStart 起始序号
 * @returns {*}
 */
export function replaceBlanksToIndex(content, indexStart) {
  indexStart = indexStart || 0;
  let index = indexStart;
  content = content.replace(new RegExp(/<mark[^>]*><\/mark>_*/g), function () {
    index++;
    return `<span class="content-blank-index">&nbsp;&nbsp;&nbsp;&nbsp;${index}&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
  });

  return content;
}

/**
 * 处理题目内容
 * @param content
 * @param subContentTypeId 基本题型id
 * @param questionType2Id  二级题型id
 * @param indexStart
 * @returns {*}
 */
export function blankReplace(content, subContentTypeId, questionType2Id, indexStart) {
  var vacants = content.match(/__\$\$__/g);
  if (vacants) {
    vacants.forEach(function (vacant, index) {
      content = content.replace(vacant, '<span class="content-blank-index">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    });
  }


  let fillBlankType = [2030024, 203008000]; // 完型填空新老题型
  // TODO 需要替换填空为序号的题型
  let replaceBlankType = [].concat(fillBlankType);

  // 完型填空和选择填空添加序号
  if (replaceBlankType.includes(questionType2Id) || subContentTypeId == 10) {
    content = replaceBlanksToIndex(content, indexStart);
  }

  return content;
}
