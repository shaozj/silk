const Generators = require("yeoman-generator");
const fs = require("fs");
const async = require("async");
// 工具函数
const prompts = require("./prompts");
const chalk = require("chalk");
// 默认要填写的内容
const path = require("path");
const glob = require("glob");
const mkdirp = require("mkdirp");
const uuidv1 = require("uuid/v1");
// 批量移动文件的方法
const cwd = process.cwd();
const packJsBundle = require("./utils/build");
const indexTestJS = path.join(cwd, "./src/index.test.js");
// 源文件的路径
// https://ivweb.io/topic/59999645e85cf527bb60f0d5
class AppGenerator extends Generators.Base {
  constructor(args, options) {
    super(args, options);
    this.option("skip-welcome-message", {
      desc: "Skip the welcome message",
      type: Boolean,
      defaults: false
    });
    this.option("skip-install");
    this.config.save();
  }

  initializing() {
    if (!this.options["skip-welcome-message"]) {
      this.log(require("yeoman-welcome"));
      this.log(
        "Out of the box I include Webpack and some default React components.\n"
      );
    }
  }

  prompting() {
    return this.prompt(prompts).then(answers => {
      this.demoName = answers.demoName;
      this.desc = answers.desc;
      this.config.set("demoName", this.demoName);
      this.config.set("desc", this.desc);
    });
  }

  configuring() {}

  /**
   * 产生一个demo文件夹，将我们的文件移动到里面
   */
  writing() {
    const demoJSLists = this.config.get("demoJSLists");
    const sourceCode = this.config.get("sourceCode");
    const id = this.config.get("id");
    // 严格按照顺序:必须先生成readme
    if (!this.config.get("readmeGenerated")) {
      this.log(chalk.red("你需要先运行silk readme产生readme文件,程序将退出....."));
      process.exit(0);
    }
    const markdownDemoTemplate = `---
title: ${this.config.get("demoName")}
dependencies:
${demoJSLists}
---

## ${this.config.get("demoName")}

${this.config.get("desc")}

\`\`\`css

\`\`\`

\`\`\`js
${sourceCode}
\`\`\`

\`\`\`html
<div id="${id}"></div>
\`\`\`
`;

    const demoPath = path.join(cwd, "./demo");
// silk demo的时候没有推送到gitlab，是否自动推送？
    mkdirp(demoPath, err => {
      fs.writeFile(
        demoPath + `/${uuidv1()}.md`,
        markdownDemoTemplate,
        ()=> {
          this.log(chalk.green("使用实例文件写入完毕...."));
          this.log(chalk.green("你可以在js代码块修改你的代码...."));
        }
      );
    });
  }

  install() {}

  end() {
    this.log(chalk.green("Generator执行完成，准备退出....."));
    process.exit(0);
  }
}
module.exports = AppGenerator;
