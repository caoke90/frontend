/**
 * @author junlin.yan
 * @date 2018/8/1
 * @description Test file template
 */

/**
 * 计算字符串长度
 * @param str
 * @returns {number}
 */
export function strlen(str) {
  let s = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i).match(/[\u0391-\uFFE5]/)) {
      s += 2;
    } else {
      s++;
    }
  }
  return s;
}
