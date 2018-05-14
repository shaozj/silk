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
 * 数组去重
 */
function unique(arr) {
  var res = arr.filter(function(item, index, array) {
    return array.indexOf(item) === index;
  });
  return res;
}

/**
 * 过滤掉未导出的组件,引用删除
 * imports:[{source:'',name:''}]
 * exportNames:['x','x']
 */
function filterNotExportedLib(imports, exportNames) {
  const localImports = [];
  for (let t = 0, len = imports.length; t < len; t++) {
    if (exportNames.indexOf(imports[t] && imports[t].name) != -1) {
      localImports.push(imports[t]);
      //       imports.splice(t, 1);
      // for循环不要动态删除数据
    }
  }
  return localImports;
}
/**
 *
*import AutoSeekCtr from './lib/AutoSeekCtr/index.js';
*import MaterialUps from './lib/MaterialUps/index.js';
*import VideoPreview from './lib/VideoPreview/index.js';
*import KuVideo from './lib/YouKuH5Player/index.js';
*export { AutoSeekCtr, MaterialUps, VideoPreview, KuVideo };
 */
module.exports = function transformer(content) {
  let imports = [],
    exportNames = [],
    globalExportDefaultName = "",
    classExportsDefaultName = "",
    isClssDefaultExport = false;
  const inputAst = parser(content);
  traverse(inputAst, {
    ImportDeclaration: function(importPath) {
      const importPathNode = importPath.node;
      const importSource = importPathNode.source && importPathNode.source.value;
      const specifiers = importPathNode.specifiers;
      //   这里的specifiers会是一个数组
      for (let i = 0, len = specifiers.length; i < len; i++) {
        if (specifiers[i].type == "ImportDefaultSpecifier") {
          const importObject = { source: importSource };
          importObject["name"] =
            specifiers[i] && specifiers[i].local && specifiers[i].local.name;
          imports.push(importObject);
        }
      }
    },

    ExportDefaultDeclaration: function(ExportDefaultPath) {
      const ExportDefaultPathNode = ExportDefaultPath.node;
      const exportDefaultName =
        (ExportDefaultPathNode.declaration &&
          ExportDefaultPathNode.declaration.name) ||
        (ExportDefaultPathNode.declaration &&
          ExportDefaultPathNode.declaration.id &&
          ExportDefaultPathNode.declaration.id.name) ||
        "";
      if (
        ExportDefaultPathNode.declaration &&
        ExportDefaultPathNode.declaration.name
      ) {
        isClssDefaultExport = true;
        classExportsDefaultName =
          ExportDefaultPathNode.declaration &&
          ExportDefaultPathNode.declaration.name;
      }
      if (
        ExportDefaultPathNode.declaration &&
        ExportDefaultPathNode.declaration.id &&
        ExportDefaultPathNode.declaration.id.name
      ) {
        isClssDefaultExport = true;
        classExportsDefaultName =
          ExportDefaultPathNode.declaration &&
          ExportDefaultPathNode.declaration.id &&
          ExportDefaultPathNode.declaration.id.name;
      }
      // 后面这种是class分类
      globalExportDefaultName = exportDefaultName;
    },

    ExportNamedDeclaration: function(ExportNamePath) {
      const ExportPathNode = ExportNamePath.node;
      const exportSpecifiers = ExportPathNode.specifiers;
      for (let i = 0, len = exportSpecifiers.length; i < len; i++) {
        const exportSpecifier = exportSpecifiers[i];
        if (
          exportSpecifier.type == "ExportSpecifier" &&
          exportSpecifier.local &&
          exportSpecifier.local.name
        ) {
          exportNames.push(exportSpecifier.local.name);
        }
      }
    }
  });

  // export default和export都导出的情况
  if (globalExportDefaultName) {
    exportNames.push(globalExportDefaultName);
    exportNames = unique(exportNames);
  }
  imports = filterNotExportedLib(imports, exportNames);
  console.log("导出的exportNames为===" + JSON.stringify(exportNames));
  console.log("imports===" + JSON.stringify(imports));
  console.log("isClssDefaultExport====" + isClssDefaultExport);
  if (isClssDefaultExport) {
    // class默认导出策略
    imports.push({
      source: "./index.js",
      name: classExportsDefaultName
    });
  }
  return {
    imports,
    exportNames
  };
};
