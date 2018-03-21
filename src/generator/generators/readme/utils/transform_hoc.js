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
module.exports = function transformer(content) {
  const inputAst = parser(content);
  traverse(inputAst, {
    ExpressionStatement: function(ExpressionPath) {
      const ExpressionPathNode = ExpressionPath.node;
      const AssignmentExpression = ExpressionPathNode.expression;
      if (AssignmentExpression.type == "AssignmentExpression") {
        const { left, right } = AssignmentExpression;
        let leftName = left.name;
        if (
          right.type == "CallExpression" &&
          right.callee &&
          right.callee.type == "CallExpression" &&
          right.callee.callee &&
          right.callee.callee.type == "MemberExpression"
        ) {
          const { object, property } = right.callee.callee;
          if (object.name == "Form" && property.name == "create") {
            console.log('移除Form.create方法');
            ExpressionPath.remove();
          }
        }
      }
    }
  });

  return {
    inputAst
  };
};
