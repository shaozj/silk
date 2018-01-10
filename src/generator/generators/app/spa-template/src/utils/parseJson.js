// 封装 JSON.parse
import { Modal } from 'antd';

function parseJson(str, name) {
  let obj = null;
  if (str && str != '') {
    try {
      obj = JSON.parse(str);
    } catch (err) {
      Modal.error({
        title: '解析 json 字符串出错',
        content: `变量名为 ${name}, 字符串为: ${str}, 错误: ${JSON.stringify(err)}`
      });
    }
  }
  return obj;
}

export default parseJson;
