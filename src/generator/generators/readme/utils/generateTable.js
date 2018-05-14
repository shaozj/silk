const exist = require("exist.js");
const fs = require("fs");
const table = require("markdown-table");
/**
 * 
 * 去掉字符串换行符，防止markdown-table出错
 */
function stripLineBreak(str) {
  return str.replace(/[\r\n]/g, "");
}
/**
 * 
 * 生成markdown的表格
 * componentInfoArray.push({
    specifier: exportNames[idx],
    documentation
 });
 */
function generateBitMarkdownTable(data) {
  const processedTables = [];
  for (let i = 0, len = data.length; i < len; i++) {
    const tables = [["属性", "说明", "类型", "默认值"]];
    const locale = data[i].documentation.props || {};
    const specifier = data[i].specifier;
    const attributes = Object.keys(locale);
    // 获取所有的props,即attributes集合
    for (let j = 0, length = attributes.length; j < length; j++) {
      const attributeDefination = locale[attributes[j]];
      // 具体的某一个props定义
      const attr = attributes[j];
      // 这里的props的key
      const type = exist.get(attributeDefination, "type.name");
      // 得到属性类型
      const description = exist.get(attributeDefination, "description");
      // 组件的description
      const value = exist.get(attributeDefination, "defaultValue.value", "");
      // 默认值
      tables.push([
        attr,
        !description ? "-" : description,
        type,
        !value ? "-" : JSON.stringify(stripLineBreak(value))
      ]);
    }
    // console.log("产生bitable的原料为===", tables);
    const bitTable = table(tables);
    processedTables.push({
      specifier,
      bitTable
    });
  }
  return processedTables;
}

module.exports = {
  generateBitMarkdownTable
};
