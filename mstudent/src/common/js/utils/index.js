/**
 * @author junlin.yan
 * @date 2018/6/7
 * @description 工具方法
 */

/**
 * 空操作
 */
export function noop() {
}

/**
 * 获取平台
 * @returns {string}    平台类型（"pc" | "android" | "ios"）
 */
export function platform() {
  let result = '';
  if (/iPhone|iPad|iPod|iOS/i.test(navigator.userAgent)) {
    result = 'ios';
  } else if (/Android/i.test(navigator.userAgent)) {
    result = 'android';
  } else {
    result = 'pc';
  }
  return result;
}

/**
 * 生成一个随机id
 * @param prefix 前缀
 * @returns {string}
 */
export function getGUID(prefix) {
  let s = [];
  let hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  // bits 12-15 of the time_hi_and_version field to 0010
  s[14] = '4';
  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';

  return (prefix ? prefix + '-' : '') + s.join('');
}

/**
 * 比较两个版本号的大小
 * 条件: 版本号是以.分割的 子版本号的级数可以不一致
 * @param firstVersion 第一个参数
 * @param secondVersion 第二个参数
 * @return number 如果返回1表示前者大于后者, -1表示小于，0表示相等
 */
export function compareAppVersion(firstVersion, secondVersion) {
  let result = 0;
  let firstArr = firstVersion.split('.');
  let secondArr = secondVersion.split('.');
  let firstArrLen = firstArr.length;
  let secondArrLen = secondArr.length;

  // 级数是否相等
  let hasEqualLen = false;
  if (firstArrLen === secondArrLen) {
    hasEqualLen = true;
  }

  // 需要对比判断的级数
  let compareLen;
  if (hasEqualLen) {
    compareLen = firstArrLen;
  } else {
    compareLen = firstArrLen > secondArrLen ? secondArrLen : firstArrLen;
  }

  // 判断级数相等的部分
  for (let i = 0; i < compareLen; i++) {
    if (parseInt(firstArr[i]) === parseInt(secondArr[i])) {
      continue;
    } else {
      result = parseInt(firstArr[i]) > parseInt(secondArr[i]) ? 1 : -1;
      break;
    }
  }

  // 判断级数不等的部分
  if (result === 0 && !hasEqualLen) {
    result = firstArrLen > secondArrLen ? 1 : -1;
  }
  return result;
}

/**
 * 用于扩展当前对象
 * 第一个参数：要扩展的对象，第二个参数：扩展的属性
 */
export function extend(target, source) {
  for (let i = 1; i < arguments.length; i++) {
    let source = arguments[i];

    if (!source || source === target) {
      continue;
    }

    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  target = target || {};
  return target;
}

/**
 * 去除字符串两端空白字符
 * @param str
 * @returns {*}
 */
export function trim(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/**
 * 判断是否空对象
 * @param obj
 * @returns {boolean}}
 */
export function isEmptyObject(obj) {
  for (let i in obj) {
    return false;
  }
  return true;
}

/**
 * 对数字排序
 * @param arr
 * @param field
 * @param order
 * @returns {Array}
 */
export function listSort(arr, field, order) {
  let refer = [];
  let result = [];
  order = order === 'asc' ? 'asc' : 'desc';
  let index = null;
  for (let i = 0; i < arr.length; i++) {
    refer[i] = arr[i][field] + ':' + i;
  }

  refer.sort();
  if (order === 'desc') {
    refer.reverse();
  }

  for (let i = 0; i < refer.length; i++) {
    index = refer[i].split(':');
    index = index[index.length - 1];
    result[i] = arr[index];
  }
  return result;
}

/**
 * 判断是否是函数
 * @param val
 * @returns {boolean}}
 */
export function isFunction(val) {
  return getType(val) === 'function';
}

// 学科Map
const subjectMap = {
  'chinese': 1,
  'math': 2,
  'english': 3,
  'physics': 4,
  'chemistry': 5,
  'biology': 6,
  'politics': 7,
  'geography': 8,
  'history': 9
};

/**
 * 根据学科取学科Id
 * @param subject
 * @returns {*|number}
 */
export function subjectToId(subject) {
  let subjectId = subjectMap[subject] || 0;
  return subjectId;
}

/**
 * 根据学科Id取学科
 * @param subjectId
 * @returns {string}
 */
export function idToSubject(subjectId) {
  let subject = '';
  for (let id in subjectMap) {
    if (id == subjectId) {
      subject = subjectMap[id];
      break;
    }
  }
  return subject;
}

/**
 * 获取数据类型
 * @param o
 * @returns {string}
 */
export function getType(o) {
  let _target;
  return ((_target = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _target).toLowerCase();
}

/**
 * 转换为驼峰结构  Venus复制过来的, 转的不全先用着吧
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
    let dataBasType = typeof (data);
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
        let itemBasType = typeof (item);
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
