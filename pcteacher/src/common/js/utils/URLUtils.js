/**
 * @author junlin.yan
 * @date 2018/6/7
 * @description URL工具方法
 */

/**
 * 用于扩展当前对象
 * 第一个参数：要扩展的对象，第二个参数：扩展的属性
 */
function extend(target, source) {
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

  return target;
}

/**
 * 解析url查询参数
 * @TODO 添加对jquery编码方式的支持
 * @param url url
 */
export function getQueryParams(url) {
  let params = {};
  let queryString = url.substring(url.search(/\?/) + 1);

  // 去掉参数上hash信息
  let hashIndex = queryString.search(/#/);
  if (hashIndex > -1) {
    queryString = queryString.substring(0, hashIndex);
  }

  let kvs = queryString.split('&');
  kvs.forEach(function (kv) {
    let pair = kv.split('=', 2);
    if (pair.length !== 2 || !pair[0]) {
      console.log('[URLUtil] invalid query params: ' + kv);
      return;
    }
    let name = decodeURIComponent(pair[0]);
    let value = decodeURIComponent(pair[1]);
    params[name] = value;
  });
  return params;
}

/**
 * 将参数连接到指定URL后面
 * @param url url
 * @param params 一个map，包含要连接的参数
 * @return string 连接后的URL地址
 */
export function joinQueryParams(url, params) {
  if (url == null) return url;
  // 首先将url解析为空url和params列表
  let oriURL = url.split('?')[0];
  let oriParams = getQueryParams(url);

  let oriQueryString = url.split('?')[1] || '';
  let hash = getHash(oriQueryString);

  // 用新参数覆盖老map
  let targetParams = extend(oriParams, params);

  // 整理成为数组
  let tempArr = [];
  for (let key in targetParams) {
    if (oriParams.hasOwnProperty(key)) {
      tempArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(targetParams[key]));
    }
  }
  // 连接参数列表到url
  url = oriURL + '?' + tempArr.join('&');
  // 然后加上hash
  url += hash;
  return url;
}

/**
 * 获取hash
 * @param string path
 * @return string hash
 */
export function getHash(path) {
  let index = path.indexOf('#');
  if (index >= 0) {
    let hash = path.substr(index);
    return hash;
  }
  return '';
}

/**
 * 规整url
 * @param url
 */
export function trimURL(url) {
  // 去除多余的"/"，如果是以"//"起始的，不替换
  url = url.replace(/([^:/])\/{2,}/g, '$1/');
  // 处理"/../"
  let reg = /\/[^/.]+?\/\.\.\//;
  while (reg.test(url)) {
    url = url.replace(reg, '/');
  }
  return url;
}

/**
 * 替换url中的host
 * @param url       url
 * @param host      要替换的host
 * @param forced    是否强制替换（默认false）
 */
export function wrapHost(url, host, forced) {
  if (!url) {
    return url;
  }
  if (!host) {
    return url;
  }
  host = host || '/';

  let re = /^(?:[^/]+):\/{2,}(?:[^/]+)\//;
  let arr = url.match(re);
  if (arr != null && arr.length > 0) {
    if (forced) {
      url = url.substr(arr[0].length);
      url = host + '/' + url;
    }
  } else {
    url = host + '/' + url;
  }
  // 最后规整一下url
  url = trimURL(url);
  return url;
}

/**
 * 将网址转换为绝对地址
 * @param relativePath
 */
export function wrapAbsolutePath(relativePath) {
  // 获取当前页面的url
  let curPath = window.location.href;
  let tempIndex = curPath.lastIndexOf('/');
  curPath = curPath.substring(0, tempIndex + 1);
  return (curPath + relativePath);
}
