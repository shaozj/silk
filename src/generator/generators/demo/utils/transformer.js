"use strict";
const babylon = require("babylon");
const types = require("babel-types");
const traverse = require("babel-traverse").default;
const generateRandomKey = require("./util");
function parser(content) {
  return babylon.parse(content, {
    sourceType: "module",
    plugins: [
      "jsx",
      "flow",
      "asyncFunctions",
      "classConstructorCall",
      "doExpressions",
      "trailingFunctionCommas",
      "objectRestSpread",
      "decorators",
      "classProperties",
      "exportExtensions",
      "exponentiationOperator",
      "asyncGenerators",
      "functionBind",
      "functionSent"
    ]
  });
}

/**
 * 关心相对路径与components开头的路径，将他们暴露到window上，最终要实现可配置数组
 */
function shouldHaveFocus(path) {
  // return path && /(\.|components)\S*/.test(path);
  return path;
}
/**
 * 1.getElementByTagName无法支持
 * 2.如果它的mock数据是来自于这个index.test.js，那么无法获取，除非采用抓取放到index.js中
 * 3.有下面的几种方式引入，都需要暴露到window上面。直接对这几个文件的单独打包，并直接写入到markdown的头部中....
 *   import BizTypeSelect from 'components/BizTypeExtraSelect/BizTypeExtraSelect';
 *   import schema from './mock/schema.js';
 *   import data from './mock/data.js';
 *   import './mock/mock.js';
 */
module.exports = function transformer(content) {
  let imports = [],
    id = "",
    specifiers = [];
  const inputAst = parser(content);
  traverse(inputAst, {
    ImportDeclaration: function(importPath) {
      const importPathNode = importPath.node;
      const importSource = importPathNode.source && importPathNode.source.value;
      const specifier =
        importPathNode.specifiers &&
        importPathNode.specifiers[0] &&
        importPathNode.specifiers[0].local &&
        importPathNode.specifiers[0].local.name;
      if (specifier) {
        specifiers.push(specifier);
      }
      // 处理import "react"这种类型
      if (!specifier) {
        specifiers.push(generateRandomKey());
      }
      if (shouldHaveFocus(importSource)) {
        imports.push(importSource);
      }
      importPath.remove();
    },
    /**
     * 处理require('xx')这种类型
     */
    VariableDeclaration: function(VariablePath) {
      const VariablePathNode = VariablePath.node;
      const VariableDeclarator = VariablePathNode.declarations[0];
      const { id, init } = VariableDeclarator;
      let library = "";
      if (
        init.type == "CallExpression" &&
        init.callee &&
        init.callee.name == "require"
      ) {
        library = init.arguments[0].value;
        specifiers.push(id.name);
        imports.push(library);
        VariablePath.remove();
      }
    },
    // 前提是index.test.js只有一个class声明,移除import后的内容就是最终的实例内联js
    ClassDeclaration: function(CallPath) {
      // let classCode = '';
      // const CallPathNode = CallPath.node;
      // const idNode = CallPathNode.id;
      // const superClassNode = CallPathNode.superClass;
      // const bodyNode = CallPathNode.body;
      // const identifier = id.name;
    },
    CallExpression: function(CallPath) {
      const CallPathNode = CallPath.node;
      if (
        CallPathNode.callee &&
        CallPathNode.callee.object &&
        CallPathNode.callee.object.name === "ReactDOM" &&
        CallPathNode.callee.property &&
        CallPathNode.callee.property.name === "render"
      ) {
        let idNode = CallPathNode.arguments[1];
        if (
          idNode.callee.object.name == "document" &&
          idNode.callee.property.name == "getElementById"
        ) {
          id = idNode.arguments[0].value;
        }
      }
    }
  });
  return {
    id,
    // div的id
    imports,
    // import的地址
    specifiers,
    // ReactDOM等
    inputAst
  };
};
