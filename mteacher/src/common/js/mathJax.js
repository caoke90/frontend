/**
 * @author junlin.yan
 * @date 2018/6/8
 * @description MathJax
 */

/**
 * 渲染数学公式
 */
export function mathJax(el, callback) {
  if (window.MathJax) {
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, el], function () {
      callback && callback();
    });
  } else {
    alert('MathJax未成功加载，请重试！');
  }
}
