/*通用函数*/

// 是否包含空HTML标签
export function voidLabel(str) {
    return /^\s*(<[a-z\/]*?>\s*)*$/.test(str);
}

// 字符串去重
export function trim(str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/**
 * 获取对象类型
 * @param  {[type]} o [description]
 * @return {[type]}   [description]
 */
export function getType(o){
    let _target;
    return ((_target = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase();
}

// 生成唯一标志
export function GUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
}

// 空对象
export function isEmptyObject(obj) {
    for (let i in obj) {
        return false;
    }
    return true;
}

// 根据新二级题型ID 判断是哪种题型
export function getOralType(o) {
    let ORAL = {
        '203016000': '短文朗读',
        '203016001': '听选信息',
        '203016002': '回答问题',
        '203016003': '信息转述',
        '203016004': '询问信息',
        '203016005': '情景对话',
        '203016006': '情景反应',
        '203016007': '情景问答',
        '203016008': '口头表达',
        '203016009': '听后记录并转述',
        '203016010': '读单词',
        '203016011': '读句子'
    };
    o += '';
    if (!ORAL[o]) { return false; }
    return { id: o, oralTxt: ORAL[o], oralId: o.slice(6, 9) };
}

/**
 * 转换为驼峰结构
 * @param json
 * @returns {*}
 */
export function parseCamelCase(json) {
    let upperFirstCase = (all, g1, offset) => {
        offset = Boolean(offset);
        if (offset) {
            return (g1 + '').toUpperCase();
        }
        return g1;
    };
    let recursionParseObject = (obj) => {
        let classType = getType(obj);
        if (classType == "object") {
            let newObj = {};
            if (!obj.id) {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        let element = obj[key];
                        let attr = key.replace(/_([a-z]|[0-9])/ig, upperFirstCase);
                        newObj[attr] = deepParseUnderline2CamelCase(element);
                    }
                }
                return newObj;
            } else {
                console.log('sniff-message:the data has been parsed to camelCase')
                return obj;
            }
        } else if (classType == "array") {
            let newArr = [];
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let eleArr = obj[key];
                    newArr[key] = deepParseUnderline2CamelCase(eleArr);
                }
            }
            return newArr;
        }
    }
    let deepParseUnderline2CamelCase = (data) => {
        //“undefined” “boolean” “string” “number” “function” “object”
        let dataBasType = typeof(data);
        let dataDeepType = getType(data)
        if (dataBasType != 'object' && dataBasType != 'function') {
            return data;
        }
        if (dataBasType == 'function') {
            throw TypeError('The data shouldn\'t contain function type value');
        }

        //对象的第一级 值为数组（['',''],[[],[]],[{a:},{b:}]）
        if (dataDeepType == 'array') {
            let fstArr = [];
            for (let item of data) {
                //item为{a:,a2:}(值可能为数组、对象。递归)
                //或者[](值可能为数组、对象。递归)
                let itemBasType = typeof(item);
                let itemDeepType = getType(item);
                if (itemBasType != 'object' && itemBasType != 'function') {
                    fstArr.push(item);
                } else if (itemDeepType === 'object' || itemDeepType === 'array') {
                    fstArr.push(recursionParseObject(item));
                }
            }
            return fstArr;
        }
        return recursionParseObject(data);
    }
    return deepParseUnderline2CamelCase(json);
}

/**
 * 替换下划线
 * @param  {[type]} txt [description]
 * @return {[type]}     [description]
 */
export function underline(txt) {
    if (!txt) { return ''; }
    let replaceStr = 'display: inline; border-bottom: 1px solid #000';
    return txt.replace(/text-decoration-line: underline/g, replaceStr);
}

/**
 * 简单计算音频时长
 */
export async function calculateTime(url) {
    if (!url) { return 0; }
    let duration = 0;
    await new Promise((resolve, reject) => {
        let audio = new Audio(url);
        // 加载完成
        audio.onloadedmetadata = function () {
            duration = audio.duration;
            resolve();
        }
        // 加载出错
        audio.onerror = resolve;
        // 加载音频
        audio.load();

    });
    return duration;
}
