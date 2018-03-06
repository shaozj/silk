const exist = require("exist.js");
const fs = require("fs");
const table = require("markdown-table");
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
    const locale = data[i].documentation.props;
    const specifier = data[i].specifier;
    const attributes = Object.keys(locale);
    for (let j = 0, length = attributes.length; j < length; j++) {
      const attributeDefination = locale[attributes[j]];
      const attr = attributes[j];
      const type = exist.get(attributeDefination, "type.name");
      const description = exist.get(
        attributeDefination,
        "description",
        "作者比较懒，请联系作者"
      );
      const value = exist.get(attributeDefination, "defaultValue.value", "");
      tables.push([attr, description, type, value]);
    }
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
