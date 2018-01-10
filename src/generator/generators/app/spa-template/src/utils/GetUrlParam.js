/**
 * getUrlParam 获得 url 上的单个查询参数值
 * @param  {string} name 参数名称
 * @param  {string} url
 * @return {any} 参数值
 */
export default function getUrlParam(name, url) {
  if (!url) {
    url = location.href;
  }
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
  //构造一个含有目标参数的正则表达式对象
  var reg = new RegExp('(\\?|&)' + name + '=([^&#]*)');
  //匹配目标参数
  var r = url.match(reg);
  //返回参数值
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}
