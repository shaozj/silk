const Generators = require("yeoman-generator");
const fs = require("fs");
const async = require("async");
// 工具函数
const prompts = require("./prompts");
// 默认要填写的内容
const path = require("path");
const glob = require("glob");
const mkdirp = require("mkdirp");
const uuidv1 = require("uuid/v1");
// 批量移动文件的方法
const cwd = process.cwd();
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
    
    const markdownDemoTemplate = `---
title: ${this.config.get("demoName")}
dependencies:
- https://unpkg.com/react/dist/react.js
---

## ${this.config.get("demoName")}

${this.config.get("desc")}

\`\`\`css
<!-- 这里是内联的css -->
\`\`\`

\`\`\`js
//这里是内联的js
\`\`\`

\`\`\`html
<!-- 这里是内联的html -->
<div id="react-content"></div>
\`\`\`
`;

    const demoPath = path.join(cwd, "./demo");

    mkdirp(demoPath, err => {
      fs.writeFile(
        demoPath + `/${uuidv1()}.md`,
        markdownDemoTemplate,
        function() {
          console.log("使用实例文件写入完毕!");
        }
      );
    });
  }

  install() {}

  end() {
    this.log("Generator执行完成，准备退出.....");
    process.exit(0);
  }
}
module.exports = AppGenerator;
