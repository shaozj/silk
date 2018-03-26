const utils = require("./utils/all");

/**
 * 
 * prevPrompts 
 */
function generatePrompts(prevPrompts) {
  const category = prevPrompts.get('category');
  const appName = prevPrompts.get('appName');
  const chineseName = prevPrompts.get('chineseName');
  const frame = prevPrompts.get('frame');
  const platform = prevPrompts.get('platform');
  const overallDesc = prevPrompts.get('overallDesc');
  const when2Use = prevPrompts.get('when2Use');
  const developer = prevPrompts.get('developer');
  const respository = prevPrompts.get('respository');
  const demoTitle = prevPrompts.get('demoTitle');
  const desc = prevPrompts.get('desc');
  
  return [
    {
      type: "confirm",
      name: "publish",
      message: "请确认是否将组件发布到规范站点"
    },
    {
      type: "input",
      name: "category",
      message: "组件所属category",
      default:category
    },
    {
      type: "input",
      name: "appName",
      message: "组件英文名称",
      default:appName
    },
    {
      type: "input",
      name: "chineseName",
      message: "组件中文名称",
      default:chineseName
    },
    {
      type: "list",
      name: "frame",
      choices: utils.config.getChoices("frame"),
      message: "组件所属技术栈",
      default:frame
    },
    {
      type: "list",
      name: "platform",
      choices: utils.config.getChoices("platform"),
      message: "组件运行的终端",
      default:platform
    },
    {
      type: "input",
      name: "overallDesc",
      message: "组件说明",
      default:overallDesc
    },
    {
      type: "input",
      name: "when2Use",
      message: "何时使用",
      default:when2Use
    },
    {
      type: "input",
      name: "developer",
      message: "开发者",
      default:developer
    },
    {
      type: "input",
      name: "respository",
      message: "仓库地址(请提供有效的gitlab仓库地址)",
      default:respository
    },
    {
      type: "input",
      name: "demoTitle",
      message: "demo标题",
      default: "基本用法",
      default:demoTitle
    },
    {
      type: "input",
      name: "desc",
      message: "demo描述",
      default: "下面是如何使用组件的代码",
      DEFAULT:desc
    }
  ];
}

module.exports = generatePrompts;
